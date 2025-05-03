const express = require('express');
const app = express();
app.use(express.json());

// Authentication middleware
const authenticate = (req, res, next) => {
  if (req.path === '/status') {
    return next(); // Skip auth for /status
  }

  const username = req.header('Username');
  const password = req.header('Password');

  if (username !== 'admin' || password !== '4f82i5rq') {
    return res.status(401).json({ error: 'Unauthorized. Invalid credentials.' });
  }
  next();
};

// Apply authentication to all routes
app.use(authenticate);

app.post('/splitText', (req, res) => {
  const { text, delimiter } = req.body;
  if (!text || !delimiter) return res.status(400).send('Missing text or delimiter.');
  const words = text.split(delimiter);
  res.json({ result: words });
});

app.post('/validateText', (req, res) => {
  const { text, check } = req.body;
  if (text === undefined || check === undefined) return res.status(400).send('Missing text or check value.');
  const isValid = text === check;
  res.json({ valid: isValid });
});

app.post('/formatName', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Missing name' });
  }
  const parts = name.split(" ");
  if (parts.length < 2) {
    return res.status(400).json({ error: 'Name must contain at least first and last name' });
  }
  const firstName = parts[0];
  const lastName = parts[1];
  const formatted = firstName.slice(0, 2).toUpperCase() + "***" + firstName.slice(-1).toUpperCase() + " " + lastName[0].toUpperCase() + ".";
  res.json({ name: formatted });
});

app.post('/formatInteger', (req, res) => {
  const { integer } = req.body;
  if (integer === undefined) return res.status(400).send('Missing integer.');
  const formatted = parseFloat(integer).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  res.json({ result: formatted });
});

app.post('/generateCode', (req, res) => {
  const { count, characters, pattern } = req.body;
  if (count === undefined || !characters || !pattern) {
    return res.status(400).json({ error: 'Missing count, characters, or pattern' });
  }
  const codes = [];
  for (let i = 0; i < count; i++) {
    let code = '';
    for (let c of pattern) {
      code += c === '#' ? characters.charAt(Math.floor(Math.random() * characters.length)) : c;
    }
    codes.push(code);
  }
  res.json({ codes });
});

app.get('/status', (req, res) => {
  res.json({ status: "I am alive." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
