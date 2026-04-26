const mongoose = require('mongoose');

const paidEventDetailSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'eventModel'
  },
  eventModel: {
    type: String,
    required: true,
    enum: ['Event', 'EventSubmission']
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  },
  ticketCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  maxTicketsPerUser: {
    type: Number,
    default: 1,
    min: 1
  },
  isRefundable: {
    type: Boolean,
    default: false
  },
  paymentDescription: {
    type: String,
    trim: true
  },
  entryConditions: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PaidEventDetail', paidEventDetailSchema);
