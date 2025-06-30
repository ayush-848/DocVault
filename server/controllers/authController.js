const pool = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

// REGISTER
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log('🟢 Register attempt:', { username, email });

  try {
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      console.log('⚠️ Email already in use:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed');

    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3) RETURNING *`,
      [username, email, hash]
    );

    const { password_hash, ...userWithoutPassword } = newUser.rows[0];
    const token = generateToken(userWithoutPassword);
    console.log('✅ Token generated:', token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log('🍪 Cookie set for user:', userWithoutPassword.username);
    res.status(201).json({ user: userWithoutPassword });

  } catch (err) {
    console.error('🔥 Register Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      console.warn('❌ No user found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials', success:false });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!valid) {
      console.warn('❌ Incorrect password for:', email);
      return res.status(401).json({ message: 'Invalid credentials',success:false });
    }

    const { password_hash, ...userWithoutPassword } = user.rows[0];
    const token = generateToken(userWithoutPassword);
    

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: userWithoutPassword, success:true, message: 'Login successful',token });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ error: err.message, success:false, message: 'Login failed' });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });

  console.log('👋 Token cookie cleared, user logged out');
  res.json({ message: 'Logged out' });
};
