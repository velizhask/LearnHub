const express = require('express');
const axios = require('axios');
const { booksLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

// Apply books-specific rate limiting
router.use(booksLimiter);

router.get('/search', async (req, res) => {
  try {
    const { q, startIndex = 0, maxResults = 12 } = req.query;
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q,
        startIndex,
        maxResults,
        key: process.env.GOOGLE_BOOKS_API_KEY
      }
    });

    const books = response.data.items?.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      averageRating: item.volumeInfo.averageRating,
      publishedDate: item.volumeInfo.publishedDate,
      categories: item.volumeInfo.categories,
      previewLink: item.volumeInfo.previewLink
    })) || [];

    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const queries = ['education', 'science', 'programming', 'mathematics'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: randomQuery,
        maxResults: 20,
        key: process.env.GOOGLE_BOOKS_API_KEY
      }
    });

    const books = response.data.items?.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      averageRating: item.volumeInfo.averageRating,
      publishedDate: item.volumeInfo.publishedDate,
      categories: item.volumeInfo.categories,
      previewLink: item.volumeInfo.previewLink
    })) || [];

    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured books' });
  }
});

module.exports = router;