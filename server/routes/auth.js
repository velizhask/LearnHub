const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

// Apply auth-specific rate limiting to sensitive endpoints
router.use('/register', authLimiter);
router.use('/login', authLimiter);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

// Regular auth routes
router.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Remove username uniqueness check - allow duplicate names

    console.log('Creating new user...');
    const user = await User.create({ name, email, password });
    console.log('User created successfully:', user._id);

    res.status(201).json({
      message: 'Account created successfully! Please login to continue.',
      success: true
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/profile', auth, async (req, res) => {
  try {
    const { name, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, profileImage },
      { new: true }
    ).select('-password');

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/profile/image', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: '' },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile image deleted successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;