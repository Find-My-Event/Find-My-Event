const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Initiative', 'Organization', 'Club']
  },
  logo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  aboutUs: {
    type: String,
    required: true
  },
  glimpses: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Club', clubSchema);
