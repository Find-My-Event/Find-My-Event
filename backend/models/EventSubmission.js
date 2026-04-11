const mongoose = require('mongoose');

const eventSubmissionSchema = new mongoose.Schema(
  {
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    mode: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    registeredUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    withdrawalStatus: {
      type: String,
      enum: ['none', 'pending', 'approved'],
      default: 'none'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('EventSubmission', eventSubmissionSchema);
