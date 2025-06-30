const express=require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes=require('./routes/authRoutes')
const documentRoutes = require('./routes/documentRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const pool = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config()
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173',
  'https://doc-vault-api.vercel.app'],  // Must match frontend origin exactly
  credentials: true                 // Allow cookies, authorization headers, etc.
}));


const PORT = process.env.PORT || 3000;

app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);
app.get('/protected', authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;

    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User authenticated',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('🔥 Error in /protected:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/',(req,res)=>{
    res.send("HELLO")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})