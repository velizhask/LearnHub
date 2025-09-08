const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  authors: [String],
  thumbnail: String,
  description: String,
  readingStatus: {
    type: String,
    enum: ['not-started', 'reading', 'completed'],
    default: 'not-started'
  }
}, {
  timestamps: true
});

librarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('Library', librarySchema);