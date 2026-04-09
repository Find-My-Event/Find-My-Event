const express = require('express');
const router = express.Router();

const Event = require('../models/Event');
const EventSubmission = require('../models/EventSubmission');
const { protect } = require('../middleware/authMiddleware');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// === Event Submission Routes (HEAD) ===

router.get('/approved', async (req, res) => {
  try {
    const list = await EventSubmission.find({ status: 'approved' })
      .populate('organizer', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mine', requireAuth, async (req, res) => {
  try {
    const list = await EventSubmission.find({ organizer: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/admin/pending', requireAuth, requireAdmin, async (req, res) => {
  try {
    const list = await EventSubmission.find({ status: 'pending' })
      .populate('organizer', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/submission/:id', requireAuth, async (req, res) => {
  try {
    const s = await EventSubmission.findById(req.params.id).lean();
    if (!s) return res.status(404).json({ message: 'Not found' });
    const isOwner = s.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const s = await EventSubmission.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    s.status = 'approved';
    await s.save();
    res.json({ submission: s });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/reject', requireAuth, requireAdmin, async (req, res) => {
  try {
    const s = await EventSubmission.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    s.status = 'rejected';
    await s.save();
    res.json({ submission: s });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, mode, location, capacity, imageUrl } = req.body;
    if (!title || !description || !startDate || !endDate || !mode || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const submission = await EventSubmission.create({
      organizer: req.user._id,
      title,
      description,
      startDate,
      endDate,
      mode,
      location,
      capacity: Number(capacity) || 0,
      imageUrl: imageUrl || '',
      status: 'pending',
    });
    res.status(201).json({ submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === Regular Event Routes (Remote) ===

// @desc    Get all events
// @route   GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Register for an event
// @route   POST /api/events/:id/register
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if user is already registered
    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    res.json({ message: 'Successfully registered for event', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
