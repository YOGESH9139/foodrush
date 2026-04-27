// routes/menu.js — All menu / food-item related endpoints

const express = require('express');
const router = express.Router();
const db = require('./db');

// ── GET /api/menu ──────────────────────────────────────────────────────────────
// Returns every food item joined with its restaurant name.
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.item_id, f.name, f.price, f.category, f.availability,
             r.name AS restaurant
      FROM   Food_Item f
      JOIN   Restaurant r ON f.restaurant_id = r.restaurant_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/menu/restaurant/:id ───────────────────────────────────────────────
// Returns items for a specific restaurant.
router.get('/restaurant/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT name, price, category, availability FROM Food_Item WHERE restaurant_id = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
