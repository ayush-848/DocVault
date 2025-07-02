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
      console.warn('⚠️ Attempt to register with existing email:', email);
      return res.status(400).json({
        success: false,
        message: 'Email is already in use.',
      });
    }

    const hash = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed for:', email);

    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3) RETURNING *`,
      [username, email, hash]
    );

    const { password_hash, ...userWithoutPassword } = newUser.rows[0];
    const token = generateToken(userWithoutPassword);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log('✅ Registered & cookie set for user:', username);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('🔥 Registration Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('🔑 Login attempt for:', email);

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // Avoid leaking user existence
    if (user.rows.length === 0) {
      console.warn('❌ Invalid login: email not found -', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isPasswordValid) {
      console.warn('❌ Invalid login: wrong password -', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const { password_hash, ...userWithoutPassword } = user.rows[0];
    const token = generateToken(userWithoutPassword);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log('✅ Login successful for:', userWithoutPassword.username);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error('🔥 Login Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to login at the moment. Please try again later.',
    });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });

  console.log('👋 User logged out and token cleared');

  return res.status(200).json({
    success: true,
    message: 'You have been logged out.',
  });
};
