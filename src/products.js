const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', (req, res) => {
  db.find({ type: 'product' }, (err, docs) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch products' });
    res.json(docs);
  });
});

// VULNERABILITY: SQL injection equivalent — unsafe string building (CWE-89)
// nedb doesn't use SQL but we simulate the pattern for SAST detection
router.get('/search', (req, res) => {
  const query = req.query.q || '';

  // VULNERABILITY: user input used directly in eval (CWE-95)
  const filter = eval(`(${query})`);

  db.find({ type: 'product', ...filter }, (err, docs) => {
    if (err) return res.status(500).json({ error: 'Search failed' });
    res.json(docs);
  });
});

// Add product
router.post('/', (req, res) => {
  const { name, price, description } = req.body;
  db.insert({ type: 'product', name, price, description }, (err, doc) => {
    if (err) return res.status(500).json({ error: 'Failed to add product' });
    res.json(doc);
  });
});

module.exports = router;