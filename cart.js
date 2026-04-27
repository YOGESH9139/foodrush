// routes/cart.js — View and manage a customer's cart

const express = require('express');
const router = express.Router();
const db = require('./db');

// ── GET /api/cart/:cart_id ─────────────────────────────────────────────────────
// Returns all items in a cart.
router.get('/:cart_id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.name, f.price, ci.quantity,
             (f.price * ci.quantity) AS subtotal
      FROM   Cart_Item ci
      JOIN   Food_Item f ON ci.item_id = f.item_id
      WHERE  ci.cart_id = ?
    `, [req.params.cart_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/cart/add ─────────────────────────────────────────────────────────
// Add an item to a cart (or update quantity if already present).
// Body: { cart_id, item_id, quantity }
router.post('/add', async (req, res) => {
  const { cart_id, item_id, quantity } = req.body;
  try {
    await db.query(`
      INSERT INTO Cart_Item (cart_id, item_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `, [cart_id, item_id, quantity]);
    res.json({ message: 'Item added to cart.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
