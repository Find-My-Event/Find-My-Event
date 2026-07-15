const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const EventSubmission = require('../models/EventSubmission');
const Event = require('../models/Event');
const ClubsEvent = require('../models/ClubsEvent');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all active notifications
// @route   GET /api/notifications
router.get('/', protect, async (req, res) => {
  try {
    // 1. Fetch global admin notifications
    const globalNotifications = await Notification.find({
      expiresAt: { $gte: new Date() }
    }).sort({ createdAt: -1 }).lean();

    // 2. Fetch event-specific announcements from events the user registered for
    const submissions = await EventSubmission.find({ registeredUsers: req.user._id }, 'title announcements').lean();
    const events = await Event.find({ registeredUsers: req.user._id }, 'title announcements').lean();
    const clubsEvents = await ClubsEvent.find({ registeredUsers: req.user._id }, 'title announcements').lean();

    const allRegisteredEvents = [...submissions, ...events, ...clubsEvents];
    const eventAnnouncements = [];

    allRegisteredEvents.forEach(ev => {
      if (ev.announcements && ev.announcements.length > 0) {
        ev.announcements.forEach(ann => {
          eventAnnouncements.push({
            _id: ann._id || ann.id,
            title: `📢 Update: ${ev.title}`,
            message: ann.content,
            type: 'info',
            createdAt: ann.date || ann.createdAt || new Date(),
            isEventAnnouncement: true
          });
        });
      }
    });

    // 3. Combine and sort by date descending
    const combined = [...globalNotifications, ...eventAnnouncements].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
