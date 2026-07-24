const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const db = require('../db');

// Place order
router.post('/', (req, res) => {
  const { productId, quantity, userId } = req.body;

  db.insert({ type: 'order', productId, quantity, userId, status: 'pending' }, (err, doc) => {
    if (err) return res.status(500).json({ error: 'Order failed' });

    // VULNERABILITY: command injection — user input in exec (CWE-78)
    exec(`echo Order ${productId} placed >> logs/orders.log`, (err) => {
      if (err) console.error('Log error');
    });

    res.json({ message: 'Order placed', orderId: doc._id });
  });
});

// Get orders
router.get('/', (req, res) => {
  db.find({ type: 'order' }, (err, docs) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch orders' });
    res.json(docs);
  });
});

module.exports = router;
