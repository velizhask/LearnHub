const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ goals: {} });
});

router.patch('/', (req, res) => {
  res.json({ message: 'Goals updated' });
});

module.exports = router;