const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// In-memory users storage for testing
const users = [];

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, password: hashedPassword, name };
  users.push(user);
  
  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, email, name } });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Get current user
app.get('/api/auth/me', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ user: { id: user.id, email: user.email, name: user.name } });
});

// Google Books API proxy
app.get('/api/books/search', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(`${process.env.GOOGLE_BOOKS_API}?q=${q}&key=${process.env.GOOGLE_BOOKS_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});