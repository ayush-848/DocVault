// db/init.js
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const initDB = async () => {
  try {
    const modelFiles = fs
      .readdirSync(path.join(__dirname, '../models'))
      .filter(file => file.endsWith('.sql'));

    for (const file of modelFiles) {
      const sql = fs.readFileSync(path.join(__dirname, '../models', file), 'utf8');
      await pool.query(sql);
      console.log(`✅ Executed ${file}`);
    }

    console.log('✅ Database initialized');
    process.exit(0);
  } catch (err) {
    console.error('❌ DB Init Error:', err.message);
    process.exit(1);
  }
};

initDB();
