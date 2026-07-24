const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const db = require('../db');

// VULNERABILITY: hardcoded JWT secret (CWE-798)
const JWT_SECRET = 'supersecretkey123';

// VULNERABILITY: MD5 used for password hashing (CWE-327)
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// Register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashed = hashPassword(password);

  db.insert({ type: 'user', username, password: hashed }, (err, doc) => {
    if (err) return res.status(500).json({ error: 'Registration failed' });
    res.json({ message: 'User registered', id: doc._id });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const hashed = hashPassword(password);

  db.findOne({ type: 'user', username, password: hashed }, (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// VULNERABILITY: command injection via exec() (CWE-78)
router.get('/logs', (req, res) => {
  const file = req.query.file || 'app.log';
  exec(`cat logs/${file}`, (err, stdout) => {
    if (err) return res.status(500).json({ error: 'Could not read log' });
    res.json({ logs: stdout });
  });
});

module.exports = router;