const express = require('express');
const router = express.Router();

router.post('/email', (req, res) => {
  res.json({ message: 'Email sent successfully' });
});

router.patch('/settings', (req, res) => {
  res.json({ message: 'Notification settings updated' });
});

module.exports = router;