const express = require('express');
const router = express.Router();

const Event = require('../models/Event');
const EventSubmission = require('../models/EventSubmission');
const { protect } = require('../middleware/authMiddleware');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// === Event Submission Routes (HEAD) ===

router.get('/approved', async (req, res) => {
  try {
    const list = await EventSubmission.find({ status: 'approved', withdrawalStatus: { $ne: 'approved' } })
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

router.put('/submission/:id', requireAuth, async (req, res) => {
  try {
    const s = await EventSubmission.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    
    // Only the organizer (or an admin) can update their event
    const isOwner = s.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You can only edit your own events' });
    }

    const { title, description, startDate, endDate, mode, location, capacity, imageUrl } = req.body;
    
    s.title = title || s.title;
    s.description = description || s.description;
    s.startDate = startDate || s.startDate;
    s.endDate = endDate || s.endDate;
    s.mode = mode || s.mode;
    s.location = location || s.location;
    s.capacity = capacity !== undefined ? Number(capacity) : s.capacity;
    s.imageUrl = imageUrl ?? s.imageUrl;

    await s.save();
    res.json({ submission: s });
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

// @desc    Request withdrawal of an event
// @route   PATCH /api/events/submission/:id/withdraw
router.patch('/submission/:id/withdraw', requireAuth, async (req, res) => {
  try {
    const s = await EventSubmission.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    if (s.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the organizer can withdraw this event' });
    }
    s.withdrawalStatus = 'pending';
    await s.save();
    res.json({ message: 'Withdrawal request sent to admin', submission: s });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all withdrawal requests for admin
// @route   GET /api/events/admin/withdrawals
router.get('/admin/withdrawals', requireAuth, requireAdmin, async (req, res) => {
  try {
    const list = await EventSubmission.find({ withdrawalStatus: 'pending' })
      .populate('organizer', 'name email')
      .sort({ updatedAt: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Approve or reject withdrawal request
// @route   PATCH /api/events/admin/withdrawals/:id/:action
router.patch('/admin/withdrawals/:id/:action', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { action } = req.params;
    const s = await EventSubmission.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });

    if (action === 'approve') {
      s.withdrawalStatus = 'approved';
      s.status = 'rejected'; // Or delete it? Marking as rejected removes it from public approved list
      await s.save();
      res.json({ message: 'Withdrawal approved', submission: s });
    } else {
      s.withdrawalStatus = 'none';
      await s.save();
      res.json({ message: 'Withdrawal request rejected', submission: s });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get registrations for a specific submission (organizer only)
// @route   GET /api/events/submission/:id/registrations
router.get('/submission/:id/registrations', requireAuth, async (req, res) => {
  try {
    const s = await EventSubmission.findById(req.params.id).populate('registeredUsers', 'name email age gender avatar');
    if (!s) return res.status(404).json({ message: 'Not found' });
    if (s.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(s.registeredUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, startDate, endDate, mode, location, capacity, imageUrl } = req.body;
    if (!title || !description || !startDate || !endDate || !mode || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Determine the final image URL (from upload or fallback)
    const finalImageUrl = req.file ? req.file.path : (imageUrl || '');
    
    const submission = await EventSubmission.create({
      organizer: req.user._id,
      title,
      description,
      startDate,
      endDate,
      mode,
      location,
      capacity: Number(capacity) || 0,
      imageUrl: finalImageUrl,
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

// @desc    Get registered events for user
// @route   GET /api/events/registered
router.get('/registered', requireAuth, async (req, res) => {
  try {
    const events = await Event.find({ registeredUsers: req.user._id }).lean();
    const submissions = await EventSubmission.find({ registeredUsers: req.user._id }).lean();
    
    // Normalize format
    const mappedSubmissions = submissions.map(s => ({
      ...s,
      date: s.startDate,
      venue: s.location,
      image: s.imageUrl,
      category: s.category || 'Special'
    }));

    const combined = [...events, ...mappedSubmissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(combined);
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
router.post('/:id/register', requireAuth, async (req, res) => {
  try {
    // Try finding in Event collection first
    let event = await Event.findById(req.params.id);
    let isSubmission = false;

    if (!event) {
      // If not found, check EventSubmission collection
      event = await EventSubmission.findById(req.params.id);
      isSubmission = true;
    }

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
