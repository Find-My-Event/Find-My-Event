const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  date: {
    type: String, // String to match existing frontend format (e.g. "Sat, Feb 14 • 4:45 am")
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  image: {
    type: String, // Cloudinary URL
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: String,
    default: 'Free'
  },
  seats: {
    type: String,
    default: 'Limited'
  },
  tag: {
    type: String,
    enum: ['', 'Trending', 'Hot', 'New'],
    default: ''
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
