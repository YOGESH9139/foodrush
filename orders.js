// routes/orders.js — Place order, view order history

const express = require('express');
const router = express.Router();
const db = require('./db');

// ── GET /api/orders ─────────────────────────────────────────────────────────────
// Full order history with item details.
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.order_id, o.order_date, o.status, o.total_amount,
             c.name AS customer,
             f.name AS item, oi.quantity, oi.price
      FROM   Order_Item oi
      JOIN   Food_Item  f  ON oi.item_id  = f.item_id
      JOIN   \`Orders\`   o  ON oi.order_id = o.order_id
      JOIN   Customer   c  ON o.customer_id = c.customer_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/orders/summary ──────────────────────────────────────────────────────
// Total spent per customer + order count.
router.get('/summary', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.name, SUM(o.total_amount) AS total_spent,
             COUNT(o.order_id) AS total_orders
      FROM   Customer c
      JOIN   \`Orders\` o ON c.customer_id = o.customer_id
      GROUP  BY c.customer_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/orders ─────────────────────────────────────────────────────────────
// Place a new order.
// Body: { customer_id, items: [{item_id, quantity, price}], payment_method }
router.post('/', async (req, res) => {
  const { customer_id, items, payment_method } = req.body;

  if (!customer_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'customer_id and items are required.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Calculate total
    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    // 2. Insert into `Order`
    const [orderResult] = await conn.query(
      'INSERT INTO `Orders` (customer_id, total_amount, status) VALUES (?, ?, ?)',
      [customer_id, total, 'Pending']
    );
    const order_id = orderResult.insertId;

    // 3. Insert each Order_Item
    for (const item of items) {
      await conn.query(
        'INSERT INTO Order_Item (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.item_id, item.quantity, item.price]
      );
    }

    // 4. Insert Payment record
    const method = payment_method || 'COD';
    await conn.query(
      'INSERT INTO Payment (order_id, method, status) VALUES (?, ?, ?)',
      [order_id, method, 'Pending']
    );

    await conn.commit();
    res.status(201).json({ message: 'Order placed!', order_id, total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
