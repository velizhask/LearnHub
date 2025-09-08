const express = require('express');
const Library = require('../models/Library');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Auth middleware
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

// Get user's library
router.get('/', auth, async (req, res) => {
  try {
    const library = await Library.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ library });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add book to library
router.post('/add', auth, async (req, res) => {
  try {
    const { bookId, title, authors, thumbnail, description } = req.body;
    
    const existingBook = await Library.findOne({ userId: req.userId, bookId });
    if (existingBook) {
      return res.status(400).json({ message: 'Book already in library' });
    }

    const libraryItem = await Library.create({
      userId: req.userId,
      bookId,
      title,
      authors,
      thumbnail,
      description
    });

    res.status(201).json({ message: 'Book added to library', book: libraryItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove book from library
router.delete('/:bookId', auth, async (req, res) => {
  try {
    const deleted = await Library.findOneAndDelete({ 
      userId: req.userId, 
      bookId: req.params.bookId 
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found in library' });
    }

    res.json({ message: 'Book removed from library' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book reading status
router.patch('/:bookId/status', auth, async (req, res) => {
  try {
    const { readingStatus } = req.body;
    
    const updated = await Library.findOneAndUpdate(
      { userId: req.userId, bookId: req.params.bookId },
      { readingStatus },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Book not found in library' });
    }

    res.json({ message: 'Reading status updated', book: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;