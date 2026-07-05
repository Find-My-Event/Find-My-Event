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
    type: String
  },
  glimpses: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  foundedOn: {
    type: Date
  },
  venue: {
    type: String
  },
  eventsConducted: {
    type: Number,
    default: 0
  },
  detailedDescription: {
    type: String
  },
  leadership: [{
    name: String,
    position: String,
    photoUrl: String
  }],
  organizerAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  presidentEmail: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Club', clubSchema);
