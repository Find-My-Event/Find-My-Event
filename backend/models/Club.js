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
    enum: ['Initiative', 'Organization', 'Club', 'Centre', 'Center']
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
    type: mongoose.Schema.Types.Mixed
  },
  venue: {
    type: String
  },
  eventsConducted: {
    type: String,
    default: '0'
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
  linkedinUrl: {
    type: String,
  },
  instagramUrl: {
    type: String,
  },
  gmailUrl: {
    type: String,
  },
  websiteUrl: {
    type: String,
  },
  additionalLink: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Club', clubSchema);
