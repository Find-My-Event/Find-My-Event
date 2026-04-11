const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const User = require('../models/User');
const Event = require('../models/Event');
const EventSubmission = require('../models/EventSubmission');
const Notification = require('../models/Notification');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new event (Admin only)
// @route   POST /api/admin/events
router.post('/events', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, organizer, date, venue, category, price, seats, tag } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image for the event' });
    }

    const event = new Event({
      title,
      description,
      organizer,
      date,
      venue,
      image: req.file.path,
      category,
      price,
      seats,
      tag,
      createdBy: req.user._id
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update an event (Admin only)
// @route   PUT /api/admin/events/:id
router.put('/events/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    let isSubmission = false;
    
    if (!event) {
      event = await EventSubmission.findById(req.params.id);
      isSubmission = true;
    }

    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, organizer, date, venue, category, price, seats, tag } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    
    if (isSubmission) {
      event.startDate = date || event.startDate;
      event.location = venue || event.location;
      event.capacity = seats ? Number(seats) : event.capacity;
      event.category = category || event.category;
      if (req.file) {
        event.imageUrl = req.file.path;
      }
    } else {
      event.organizer = organizer || event.organizer;
      event.date = date || event.date;
      event.venue = venue || event.venue;
      event.category = category || event.category;
      event.price = price || event.price;
      event.seats = seats || event.seats;
      event.tag = tag || event.tag;
      if (req.file) {
        event.image = req.file.path;
      }
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete an event (Admin only)
// @route   DELETE /api/admin/events/:id
router.delete('/events/:id', protect, admin, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (event) {
      await Event.deleteOne({ _id: req.params.id });
      return res.json({ message: 'Event removed' });
    }
    
    event = await EventSubmission.findById(req.params.id);
    if (event) {
      await EventSubmission.deleteOne({ _id: req.params.id });
      return res.json({ message: 'Event removed' });
    }

    res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get registrations for an event (Admin only)
// @route   GET /api/admin/events/:id/registrations
router.get('/events/:id/registrations', protect, admin, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id).populate('registeredUsers', 'name email avatar');
    if (!event) {
      event = await EventSubmission.findById(req.params.id).populate('registeredUsers', 'name email avatar');
    }
    
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    res.json(event.registeredUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a global notification (Admin only)
// @route   POST /api/admin/notifications
router.post('/notifications', protect, admin, async (req, res) => {
  try {
    const { title, message, type, expiresAt } = req.body;
    const notification = new Notification({
      title,
      message,
      type,
      expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdBy: req.user._id
    });

    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
