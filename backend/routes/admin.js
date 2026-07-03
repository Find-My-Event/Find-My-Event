const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const User = require('../models/User');
const Event = require('../models/Event');
const EventSubmission = require('../models/EventSubmission');
const Notification = require('../models/Notification');
const PaidEventDetail = require('../models/PaidEventDetail');
const Club = require('../models/Club');

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

    // Handle Paid Event Details for Admin events
    if (req.body.isPaid === 'true') {
      await PaidEventDetail.create({
        event: savedEvent._id,
        eventModel: 'Event',
        ticketPrice: Number(req.body.ticketPrice) || 0,
        ticketCapacity: Number(req.body.ticketCapacity) || Number(seats) || 1,
        maxTicketsPerUser: Number(req.body.maxTicketsPerUser) || 1,
        isRefundable: req.body.isRefundable === 'true',
        paymentDescription: req.body.paymentDescription || '',
        entryConditions: req.body.entryConditions || ''
      });
    }

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

// @desc    Remove a registered user from an event (Admin only)
// @route   DELETE /api/admin/events/:eventId/registrations/:userId
router.delete('/events/:eventId/registrations/:userId', protect, admin, async (req, res) => {
  try {
    let event = await Event.findById(req.params.eventId);
    if (!event) {
      event = await EventSubmission.findById(req.params.eventId);
    }
    
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    event.registeredUsers = event.registeredUsers.filter(
      id => id.toString() !== req.params.userId
    );
    if (event.attendedUsers) {
      event.attendedUsers = event.attendedUsers.filter(
        id => id.toString() !== req.params.userId
      );
    }
    await event.save();
    
    res.json({ message: 'User removed from event successfully' });
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

// @desc    Create a new club (Admin only)
// @route   POST /api/admin/clubs
router.post('/clubs', protect, admin, upload.single('logo'), async (req, res) => {
  try {
    const { name, type, description, aboutUs, tags } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a logo for the club' });
    }

    const club = new Club({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      name,
      type,
      description,
      aboutUs,
      logo: req.file.path,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    const savedClub = await club.save();
    res.status(201).json(savedClub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a club (Admin only)
// @route   PUT /api/admin/clubs/:id
router.put('/clubs/:id', protect, admin, upload.single('logo'), async (req, res) => {
  try {
    let club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const { name, type, description, aboutUs, tags } = req.body;

    club.name = name || club.name;
    if (name) {
      club.id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    club.type = type || club.type;
    club.description = description || club.description;
    club.aboutUs = aboutUs || club.aboutUs;
    
    if (tags) {
      club.tags = tags.split(',').map(tag => tag.trim());
    }

    if (req.file) {
      club.logo = req.file.path;
    }

    const updatedClub = await club.save();
    res.json(updatedClub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a club (Admin only)
// @route   DELETE /api/admin/clubs/:id
router.delete('/clubs/:id', protect, admin, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (club) {
      await Club.deleteOne({ _id: req.params.id });
      return res.json({ message: 'Club removed' });
    }
    res.status(404).json({ message: 'Club not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
