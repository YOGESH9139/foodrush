# 🍔 Food Rush — Setup Guide

## Project Structure

```
food-rush/
├── server.js          ← Express entry point
├── db.js              ← MySQL connection pool
├── .env               ← Your credentials (never commit this!)
├── package.json
├── routes/
│   ├── menu.js        ← GET /api/menu, GET /api/menu/restaurant/:id
│   ├── orders.js      ← GET /api/orders, POST /api/orders, GET /api/orders/summary
│   └── cart.js        ← GET /api/cart/:id, POST /api/cart/add
└── public/
    └── index.html     ← Full frontend (HTML + CSS + JS)
```

---

## Step 1 — Create the MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE food_rush;
USE food_rush;
-- Then paste and run all the CREATE TABLE + INSERT statements from Queries.docx
```

---

## Step 2 — Configure Your Credentials

Open the `.env` file and fill in your details:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=food_rush
PORT=3000
```

> ⚠️ Never commit `.env` to Git. Add it to `.gitignore`.

---

## Step 3 — Install Dependencies

```bash
cd food-rush
npm install
```

This installs: `express`, `mysql2`, `dotenv`, and `nodemon` (for development).

---

## Step 4 — Run the Server

**Production:**
```bash
npm start
```

**Development (auto-restarts on file save):**
```bash
npm run dev
```

Then open your browser at: **http://localhost:3000**

---

## API Reference

| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | `/api/menu`                  | All food items with restaurant name  |
| GET    | `/api/menu/restaurant/:id`   | Items for a specific restaurant      |
| GET    | `/api/orders`                | Full order history with item details |
| GET    | `/api/orders/summary`        | Total spent per customer             |
| POST   | `/api/orders`                | Place a new order                    |
| GET    | `/api/cart/:cart_id`         | View cart contents                   |
| POST   | `/api/cart/add`              | Add item to cart                     |

### POST /api/orders — Body Example

```json
{
  "customer_id": 1,
  "payment_method": "UPI",
  "items": [
    { "item_id": 1, "quantity": 2, "price": 250 },
    { "item_id": 7, "quantity": 1, "price": 300 }
  ]
}
```

---

## Swapping Queries Later

Each route file is isolated. To update a query:
- Menu queries → edit `routes/menu.js`
- Order queries → edit `routes/orders.js`
- Cart queries  → edit `routes/cart.js`

The database connection lives only in `db.js` — change credentials there (or in `.env`).
