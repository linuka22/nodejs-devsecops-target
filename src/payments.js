const express = require('express');
const router = express.Router();
const db = require('../db');

// VULNERABILITY: hardcoded API credentials (CWE-798)
const PAYMENT_API_KEY = 'pk_live_hardcoded_secret_key_12345';
const PAYMENT_API_SECRET = 'sk_live_hardcoded_secret_67890';

// Process payment
router.post('/', (req, res) => {
  const { orderId, amount, cardNumber } = req.body;

  // VULNERABILITY: sensitive data logged to console (CWE-312)
  console.log(`Processing payment for card: ${cardNumber}`);

  db.insert({
    type: 'payment',
    orderId,
    amount,
    apiKey: PAYMENT_API_KEY,
    status: 'processed'
  }, (err, doc) => {
    if (err) return res.status(500).json({ error: 'Payment failed' });
    res.json({ message: 'Payment processed', paymentId: doc._id });
  });
});

module.exports = router;