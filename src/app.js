const express = require('express');
const app = express();

app.use(express.json());

app.use('/auth', require('./auth'));
app.use('/products', require('./products'));
app.use('/orders', require('./orders'));
app.use('/payments', require('./payments'));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

module.exports = app;