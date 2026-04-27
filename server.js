require('dotenv').config();

const express = require('express');
const path = require('path');

const menuRoutes = require('./menu');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ✅ FIX: serve PUBLIC folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// ✅ FIX: send index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🍔 Server running at http://localhost:${PORT}`);
});