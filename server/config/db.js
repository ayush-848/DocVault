// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Accept self-signed certs (important for Neon)
  },
});

pool.connect()
  .then(() => console.log("🟢 Connected to Database"))
  .catch((err) => console.error("🔴 Connection error:", err));

module.exports = pool;
