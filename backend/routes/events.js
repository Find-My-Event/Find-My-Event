const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const { transporter } = require('../utils/email');

const Event = require('../models/Event');
const EventSubmission = require('../models/EventSubmission');
const ClubsEvent = require('../models/ClubsEvent');
const { protect } = require('../middleware/authMiddleware');
const { softAuth, requireAuth, requireAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const PaidEventDetail = require('../models/PaidEventDetail');
const ScannerLink = require('../models/ScannerLink');
const crypto = require('crypto');
const PaidRegistration = require('../models/PaidRegistration');

// === Event Submission Routes (HEAD) ===

router.get('/approved', softAuth, async (req, res) => {
  try {
    const list = await EventSubmission.find({ status: 'approved', withdrawalStatus: { $ne: 'approved' } })
      .populate('organizer', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Attach pricing details and check registration for each approved submission
    const listWithPricing = await Promise.all(list.map(async (event) => {
      const pricing = await PaidEventDetail.findOne({ event: event._id }).lean();
      if (pricing) pricing.isPaid = true;
      const isRegistered = req.user ? event.registeredUsers?.some(id => id.toString() === req.user._id.toString()) : false;
      return { ...event, pricing, isRegistered };
    }));

    res.json(listWithPricing);
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

router.put('/submission/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const s = await EventSubmission.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    
    // Only the organizer (or an admin) can update their event
    const isOwner = s.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You can only edit your own events' });
    }

    const { 
      title, description, startDate, endDate, mode, location, capacity, imageUrl,
      participantType, teamMin, teamMax, eligibility, timeline, rules, contacts, announcements, customQuestions,
      tickets, prizes, visibility, registrationControl, personalInfo, eduInfo, organizingTeam
    } = req.body;
    
    s.title = title || s.title;
    s.description = description || s.description;
    s.startDate = startDate || s.startDate;
    s.endDate = endDate || s.endDate;
    s.mode = mode || s.mode;
    s.location = location || s.location;
    s.capacity = capacity !== undefined ? Number(capacity) : s.capacity;
    
    if (req.file) {
      s.imageUrl = req.file.path;
    } else {
      s.imageUrl = imageUrl ?? s.imageUrl;
    }

    if (participantType !== undefined) s.participantType = participantType;
    if (teamMin !== undefined) s.teamMin = teamMin;
    if (teamMax !== undefined) s.teamMax = teamMax;
    if (eligibility !== undefined) s.eligibility = eligibility;
    if (timeline !== undefined) s.timeline = timeline;
    if (rules !== undefined) s.rules = rules;
    if (contacts !== undefined) s.contacts = contacts;
    if (announcements !== undefined) s.announcements = announcements;
    if (customQuestions !== undefined) s.customQuestions = customQuestions;
    if (tickets !== undefined) s.tickets = tickets;
    if (prizes !== undefined) s.prizes = prizes;
    if (visibility !== undefined) s.visibility = visibility;
    if (registrationControl !== undefined) s.registrationControl = registrationControl;
    if (personalInfo !== undefined) s.personalInfo = personalInfo;
    if (eduInfo !== undefined) s.eduInfo = eduInfo;
    if (organizingTeam !== undefined) s.organizingTeam = organizingTeam;

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

    // Handle Paid Event Details
    if (req.body.isPaid === 'true') {
      await PaidEventDetail.create({
        event: submission._id,
        eventModel: 'EventSubmission',
        ticketPrice: Number(req.body.ticketPrice) || 0,
        ticketCapacity: Number(req.body.ticketCapacity) || Number(capacity) || 1,
        maxTicketsPerUser: Number(req.body.maxTicketsPerUser) || 1,
        isRefundable: req.body.isRefundable === 'true',
        paymentDescription: req.body.paymentDescription || '',
        entryConditions: req.body.entryConditions || ''
      });
    }

    res.status(201).json({ submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === Regular Event Routes (Remote) ===

// @desc    Get all events
// @route   GET /api/events
router.get('/', softAuth, async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 }).lean();
    const eventsWithPricing = await Promise.all(events.map(async (event) => {
      const pricing = await PaidEventDetail.findOne({ event: event._id }).lean();
      if (pricing) pricing.isPaid = true;
      const isRegistered = req.user ? event.registeredUsers?.some(id => id.toString() === req.user._id.toString()) : false;
      return { ...event, pricing, isRegistered };
    }));

    const clubsEvents = await ClubsEvent.find({}).sort({ createdAt: -1 }).lean();
    const clubsEventsWithPricing = await Promise.all(clubsEvents.map(async (event) => {
      const pricing = await PaidEventDetail.findOne({ event: event._id }).lean();
      if (pricing) pricing.isPaid = true;
      const isRegistered = req.user ? event.registeredUsers?.some(id => id.toString() === req.user._id.toString()) : false;
      return { ...event, pricing, isRegistered };
    }));

    const allEvents = [...eventsWithPricing, ...clubsEventsWithPricing];
    res.json(allEvents);
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
    const clubsEvents = await ClubsEvent.find({ registeredUsers: req.user._id }).lean();
    
    // Normalize format and add pricing
    const mappedSubmissions = await Promise.all(submissions.map(async (s) => {
      const pricing = await PaidEventDetail.findOne({ event: s._id }).lean();
      const qrToken = jwt.sign({ userId: req.user._id, eventId: s._id, model: 'EventSubmission' }, process.env.JWT_SECRET || 'secret');
      return {
        ...s,
        date: s.startDate,
        venue: s.location,
        image: s.imageUrl,
        category: s.category || 'Special',
        pricing,
        qrToken
      };
    }));

    const eventsWithPricing = await Promise.all(events.map(async (e) => {
      const pricing = await PaidEventDetail.findOne({ event: e._id }).lean();
      const qrToken = jwt.sign({ userId: req.user._id, eventId: e._id, model: 'Event' }, process.env.JWT_SECRET || 'secret');
      return { ...e, pricing, qrToken };
    }));

    const mappedClubsEvents = await Promise.all(clubsEvents.map(async (ce) => {
      const pricing = await PaidEventDetail.findOne({ event: ce._id }).lean();
      const qrToken = jwt.sign({ userId: req.user._id, eventId: ce._id, model: 'ClubsEvent' }, process.env.JWT_SECRET || 'secret');
      return {
        ...ce,
        pricing,
        qrToken
      };
    }));

    const combined = [...eventsWithPricing, ...mappedSubmissions, ...mappedClubsEvents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @desc    Generate a Magic Scanner Link
// @route   POST /api/events/generate-scanner-link
router.post('/generate-scanner-link', requireAuth, requireAdmin, async (req, res) => {
  try {
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours validity

    const newLink = await ScannerLink.create({
      token,
      createdBy: req.user._id,
      expiresAt
    });

    res.json({ link: newLink });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all active Magic Links
// @route   GET /api/events/scanner-links
router.get('/scanner-links', requireAuth, requireAdmin, async (req, res) => {
  try {
    const links = await ScannerLink.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Revoke a Magic Link
// @route   DELETE /api/events/scanner-link/:id
router.delete('/scanner-link/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await ScannerLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Link revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Public route to scan via Magic Link
// @route   POST /api/events/scan-public
router.post('/scan-public', async (req, res) => {
  const { qrToken, scannerToken, deviceId } = req.body;

  if (!scannerToken || !deviceId) {
    return res.status(400).json({ message: "Missing scanner token or device ID" });
  }

  // 1. Verify the Magic Link
  const link = await ScannerLink.findOne({ token: scannerToken, isActive: true });
  if (!link) {
    return res.status(403).json({ message: "Invalid or revoked scanner link." });
  }

  if (new Date() > new Date(link.expiresAt)) {
    return res.status(403).json({ message: "This scanner link has expired." });
  }

  // 2. Device Locking Logic
  if (!link.lockedDeviceId) {
    // First time opening, lock it to this device
    link.lockedDeviceId = deviceId;
    await link.save();
  } else if (link.lockedDeviceId !== deviceId) {
    // It's already locked to another device!
    return res.status(403).json({ message: "Link active on another device." });
  }

  // 3. Verify the QR Code
  let payload;
  try {
    payload = jwt.verify(qrToken, process.env.JWT_SECRET || 'secret');
  } catch {
    return res.status(400).json({ message: "Invalid QR Code." });
  }

  const Model = payload.model === 'EventSubmission' ? EventSubmission : (payload.model === 'ClubsEvent' ? ClubsEvent : Event);

  // 4. Register Attendance
  const event = await Model.findOneAndUpdate(
    {
      _id: payload.eventId,
      registeredUsers: payload.userId,
      attendedUsers: { $ne: payload.userId }
    },
    { $addToSet: { attendedUsers: payload.userId } },
    { new: true }
  );

  if (!event) {
    const existing = await Model.findById(payload.eventId);
    if (!existing) return res.status(404).json({ message: "Event not found." });
    if (!existing.registeredUsers.includes(payload.userId))
      return res.status(403).json({ message: "User is not registered for this event." });
    return res.status(409).json({ message: "Already Scanned! Entry Denied." });
  }

  res.json({ message: "Access Granted" });
});

// @desc    Get events for a specific club by club's custom ID
// @route   GET /api/events/club/:id
router.get('/club/:id', async (req, res) => {
  try {
    const Club = require('../models/Club');
    const club = await Club.findOne({ id: req.params.id });
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    const events = await ClubsEvent.find({ clubId: club._id }).sort({ createdAt: -1 }).lean();
    
    const eventsWithPricing = await Promise.all(events.map(async (event) => {
      const pricing = await PaidEventDetail.findOne({ event: event._id }).lean();
      if (pricing) pricing.isPaid = true;
      return { ...event, pricing };
    }));

    res.json(eventsWithPricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', softAuth, async (req, res) => {
  try {
    let eventModel = 'Event';
    let event = await Event.findById(req.params.id).lean();
    
    if (!event) {
      event = await EventSubmission.findById(req.params.id).lean();
      eventModel = 'EventSubmission';
    }

    if (!event) {
      event = await ClubsEvent.findById(req.params.id).lean();
      eventModel = 'ClubsEvent';
    }

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Fetch Paid details if any
    const pricing = await PaidEventDetail.findOne({ event: event._id }).lean();
    if (pricing) {
      pricing.isPaid = true;
      event.pricing = pricing;
    }

    // Check registration status
    event.isRegistered = req.user ? event.registeredUsers?.some(id => id.toString() === req.user._id.toString()) : false;

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all participants for an event
// @route   GET /api/events/:id/participants
router.get('/:id/participants', requireAuth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id).populate('registeredUsers', 'name email phone avatar');
    if (!event) {
      event = await EventSubmission.findById(req.params.id).populate('registeredUsers', 'name email phone avatar');
    }
    if (!event) {
      event = await ClubsEvent.findById(req.params.id).populate('registeredUsers', 'name email phone avatar');
    }
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Also fetch paid registrations
    const paidRegistrations = await PaidRegistration.find({ event: event._id }).populate('user', 'name email phone avatar').lean();
    
    // Combine them
    const allParticipants = [];
    const attendedSet = new Set((event.attendedUsers || []).map(id => id.toString()));
    
    if (event.registeredUsers) {
      event.registeredUsers.forEach(u => {
        if (!u) return;
        allParticipants.push({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          avatar: u.avatar,
          type: 'Free',
          status: 'Registered',
          checkedIn: attendedSet.has(u._id.toString())
        });
      });
    }

    if (paidRegistrations) {
      paidRegistrations.forEach(r => {
        if (!r.user) return;
        // Avoid duplicates if they are somehow in both (shouldn't happen, but just in case)
        if (!allParticipants.find(p => p.id.toString() === r.user._id.toString())) {
          allParticipants.push({
            id: r.user._id,
            name: r.user.name,
            email: r.user.email,
            phone: r.user.phone,
            avatar: r.user.avatar,
            type: 'Paid',
            status: r.paymentStatus,
            answers: r.customAnswers,
            checkedIn: attendedSet.has(r.user._id.toString())
          });
        }
      });
    }

    res.json(allParticipants);
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
    let modelName = 'Event';

    if (!event) {
      // If not found, check EventSubmission collection
      event = await EventSubmission.findById(req.params.id);
      if (event) modelName = 'EventSubmission';
    }

    if (!event) {
      event = await ClubsEvent.findById(req.params.id);
      if (event) modelName = 'ClubsEvent';
    }

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if user is already registered
    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    // Generate QR Token and Image
    const qrToken = jwt.sign({ 
      userId: req.user._id, 
      eventId: event._id, 
      model: modelName
    }, process.env.JWT_SECRET || 'secret');
    
    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(qrToken, { width: 200, margin: 2 });
    } catch (err) {
      console.error('Error generating QR code:', err);
    }

    // Send Ticket Confirmation Email
    if (req.user.email && qrDataUrl) {
      try {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; text-align: center; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #8B5CF6; color: white; padding: 20px;">
              <h1 style="margin: 0; font-size: 24px;">Ticket Confirmed!</h1>
              <p style="margin: 5px 0 0;">${event.title}</p>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; font-weight: bold;">Hello ${req.user.name || 'User'},</p>
              <p>Your registration for <strong>${event.title}</strong> is successful.</p>
              <p>Please present the digital ticket below at the entry gate.</p>
              
              <div style="background: #f8f9fc; padding: 20px; border-radius: 12px; display: inline-block; margin: 20px 0;">
                <img src="cid:ticketqr" alt="Ticket QR Code" style="width: 200px; height: 200px; border-radius: 8px;" />
              </div>

              <div style="text-align: left; margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 20px;">
                <p><strong>Venue:</strong> ${event.venue || event.location}</p>
                <p><strong>Date:</strong> ${event.date || event.startDate}</p>
              </div>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; font-size: 12px; color: #6b7280;">
              Powered by Eventum
            </div>
          </div>
        `;

        const base64Data = qrDataUrl.split(';base64,').pop();

        await transporter.sendMail({
          from: '"Eventum" <' + process.env.GMAIL_USER + '>',
          to: req.user.email,
          subject: 'Your Ticket: ' + event.title,
          html: emailHtml,
          attachments: [{
            filename: 'ticket-qr.png',
            content: base64Data,
            encoding: 'base64',
            cid: 'ticketqr'
          }]
        });
      } catch (err) {
        console.error('Error sending ticket email:', err);
      }
    }

    res.json({ message: 'Successfully registered for event', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Scan QR Code for entry
// @route   POST /api/events/scan
router.post('/scan', requireAuth, async (req, res) => {
  const { qrToken } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Unauthorized" });
  }

  let payload;
  try {
    payload = jwt.verify(qrToken, process.env.JWT_SECRET || 'secret');
  } catch {
    return res.status(400).json({ message: "Invalid QR" });
  }

  const Model = payload.model === 'EventSubmission' ? EventSubmission : (payload.model === 'ClubsEvent' ? ClubsEvent : Event);

  const event = await Model.findOneAndUpdate(
    {
      _id: payload.eventId,
      registeredUsers: payload.userId,
      attendedUsers: { $ne: payload.userId }
    },
    { $addToSet: { attendedUsers: payload.userId } },
    { new: true }
  );

  if (!event) {
    const existing = await Model.findById(payload.eventId);
    if (!existing) return res.status(404).json({ message: "Event not found" });
    if (!existing.registeredUsers.includes(payload.userId))
      return res.status(403).json({ message: "Not registered" });
    return res.status(409).json({ message: "Already Scanned! Entry Denied" });
  }

  res.json({ message: "Access Granted" });
});

module.exports = router;
