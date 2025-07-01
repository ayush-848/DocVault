// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.on('error', (err) => {
  console.error('🔥 PG Pool error:', err.message);
});

console.log("🟢 Database pool initialized");

module.exports = pool;
