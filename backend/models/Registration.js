const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'eventModel'
  },
  eventModel: {
    type: String,
    required: true,
    enum: ['Event', 'EventSubmission', 'ClubsEvent']
  },
  ticketType: {
    type: String,
    default: 'Free'
  },
  customAnswers: [{
    question: String,
    answer: mongoose.Schema.Types.Mixed
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  paymentStatus: {
    type: String,
    enum: ['free', 'pending', 'completed', 'failed'],
    default: 'free'
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  qrToken: {
    type: String
  }
}, { timestamps: true });

// Prevent multiple active registrations for the same user and event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
