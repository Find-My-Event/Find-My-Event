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
    const { title, description, organizer, date, venue, category, price, seats, tag, startDate, endDate, mode, location, capacity } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image for the event' });
    }

    const event = new Event({
      title,
      description,
      organizer,
      date,
      venue,
      startDate,
      endDate,
      mode,
      location,
      capacity: capacity ? Number(capacity) : 0,
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

    const { 
      title, description, organizer, date, venue, category, price, seats, tag, startDate, endDate, mode, location, capacity,
      participantType, teamMin, teamMax, eligibility, timeline, rules, contacts, announcements, customQuestions,
      tickets, prizes, visibility, registrationControl, personalInfo, eduInfo, organizingTeam
    } = req.body;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    
    if (participantType !== undefined) event.participantType = participantType;
    if (teamMin !== undefined) event.teamMin = teamMin;
    if (teamMax !== undefined) event.teamMax = teamMax;
    if (eligibility !== undefined) event.eligibility = eligibility;
    if (timeline !== undefined) event.timeline = timeline;
    if (rules !== undefined) event.rules = rules;
    if (contacts !== undefined) event.contacts = contacts;
    if (announcements !== undefined) event.announcements = announcements;
    if (customQuestions !== undefined) event.customQuestions = customQuestions;
    if (tickets !== undefined) event.tickets = tickets;
    if (prizes !== undefined) event.prizes = prizes;
    if (visibility !== undefined) event.visibility = visibility;
    if (registrationControl !== undefined) event.registrationControl = registrationControl;
    if (personalInfo !== undefined) event.personalInfo = personalInfo;
    if (eduInfo !== undefined) event.eduInfo = eduInfo;
    if (organizingTeam !== undefined) event.organizingTeam = organizingTeam;

    if (isSubmission) {
      if (startDate !== undefined) event.startDate = startDate;
      else if (date !== undefined) event.startDate = date;
      
      if (endDate !== undefined) event.endDate = endDate;
      if (mode !== undefined) event.mode = mode;
      
      if (location !== undefined) event.location = location;
      else if (venue !== undefined) event.location = venue;
      
      event.capacity = capacity !== undefined ? Number(capacity) : (seats !== undefined ? Number(seats) : event.capacity);
      if (category !== undefined) event.category = category;
      if (req.file) {
        event.imageUrl = req.file.path;
      }
    } else {
      if (organizer !== undefined) event.organizer = organizer;
      if (date !== undefined) event.date = date;
      if (venue !== undefined) event.venue = venue;
      if (startDate !== undefined) event.startDate = startDate;
      if (endDate !== undefined) event.endDate = endDate;
      if (mode !== undefined) event.mode = mode;
      if (location !== undefined) event.location = location;
      event.capacity = capacity !== undefined ? Number(capacity) : event.capacity;
      if (category !== undefined) event.category = category;
      if (price !== undefined) event.price = price;
      if (seats !== undefined) event.seats = seats;
      if (tag !== undefined) event.tag = tag;
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
    
    const attendedSet = new Set((event.attendedUsers || []).map(id => id.toString()));
    const registrations = event.registeredUsers.filter(u => u).map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      checkedIn: attendedSet.has(u._id.toString())
    }));
    
    res.json(registrations);
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

// @desc    Get all clubs with organizer details (Admin only)
// @route   GET /api/admin/clubs
router.get('/clubs', protect, admin, async (req, res) => {
  try {
    const clubs = await Club.find({}).populate('organizerAccount', 'email').sort({ name: 1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new club (Admin only)
// @route   POST /api/admin/clubs
router.post('/clubs', protect, admin, upload.any(), async (req, res) => {
  try {
    const { name, type, description, aboutUs, tags, foundedOn, venue, eventsConducted, detailedDescription, organizerEmail, organizerPassword } = req.body;
    
    let logoFile = null;
    let teamPhotos = {};
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        if (file.fieldname === 'logo') {
          logoFile = file;
        } else if (file.fieldname.startsWith('teamPhoto_')) {
          const index = file.fieldname.split('_')[1];
          teamPhotos[index] = file.path;
        }
      });
    }

    if (!logoFile) {
      return res.status(400).json({ message: 'Please upload a logo for the club' });
    }

    // Check if email is already taken
    if (organizerEmail && organizerPassword) {
      const existingUser = await User.findOne({ email: organizerEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'A user with this organizer email already exists.' });
      }
    }

    let leadership = [];
    if (req.body.leadership) {
      try {
        const parsedLeadership = JSON.parse(req.body.leadership);
        leadership = parsedLeadership.map((member, index) => ({
          name: member.name,
          position: member.position,
          photoUrl: teamPhotos[index] || member.photoUrl || ''
        }));
      } catch (err) {
        console.error('Error parsing leadership', err);
      }
    }

    const club = new Club({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      name,
      type,
      description,
      aboutUs,
      foundedOn,
      venue,
      eventsConducted: eventsConducted ? parseInt(eventsConducted, 10) : 0,
      detailedDescription,
      leadership,
      logo: logoFile.path,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    const savedClub = await club.save();

    // Create Organizer Account if credentials provided
    if (organizerEmail && organizerPassword) {
      const organizerUser = new User({
        name: `${name} Organizer`,
        email: organizerEmail,
        password: organizerPassword,
        role: 'organizer',
        clubId: savedClub._id,
        isVerified: true
      });
      const savedUser = await organizerUser.save();
      
      // Link back to club
      savedClub.organizerAccount = savedUser._id;
      await savedClub.save();
    }
    res.status(201).json(savedClub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a club (Admin only)
// @route   PUT /api/admin/clubs/:id
router.put('/clubs/:id', protect, admin, upload.any(), async (req, res) => {
  try {
    let club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const { name, type, description, aboutUs, tags, foundedOn, venue, eventsConducted, detailedDescription, organizerEmail, organizerPassword } = req.body;
    
    let logoFile = null;
    let teamPhotos = {};
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        if (file.fieldname === 'logo') {
          logoFile = file;
        } else if (file.fieldname.startsWith('teamPhoto_')) {
          const index = file.fieldname.split('_')[1];
          teamPhotos[index] = file.path;
        }
      });
    }

    club.name = name || club.name;
    if (name) {
      club.id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    club.type = type || club.type;
    club.description = description || club.description;
    club.aboutUs = aboutUs || club.aboutUs;
    if (foundedOn !== undefined) club.foundedOn = foundedOn;
    if (venue !== undefined) club.venue = venue;
    if (eventsConducted !== undefined) club.eventsConducted = parseInt(eventsConducted, 10);
    if (detailedDescription !== undefined) club.detailedDescription = detailedDescription;
    
    if (tags) {
      club.tags = tags.split(',').map(tag => tag.trim());
    }

    if (logoFile) {
      club.logo = logoFile.path;
    }

    if (req.body.leadership) {
      try {
        const parsedLeadership = JSON.parse(req.body.leadership);
        club.leadership = parsedLeadership.map((member, index) => ({
          name: member.name,
          position: member.position,
          photoUrl: teamPhotos[index] || member.photoUrl || ''
        }));
      } catch (err) {
        console.error('Error parsing leadership', err);
      }
    }

    const updatedClub = await club.save();
    
    // Update or Create Organizer Account
    if (organizerEmail || organizerPassword) {
      if (updatedClub.organizerAccount) {
        // Update existing user
        const organizerUser = await User.findById(updatedClub.organizerAccount);
        if (organizerUser) {
          if (organizerEmail) organizerUser.email = organizerEmail;
          if (organizerPassword) organizerUser.password = organizerPassword;
          await organizerUser.save();
        }
      } else if (organizerEmail && organizerPassword) {
        // Create new user if not exist
        const existingUser = await User.findOne({ email: organizerEmail });
        if (!existingUser) {
          const organizerUser = new User({
            name: `${name} Organizer`,
            email: organizerEmail,
            password: organizerPassword,
            role: 'organizer',
            clubId: updatedClub._id,
            isVerified: true
          });
          const savedUser = await organizerUser.save();
          updatedClub.organizerAccount = savedUser._id;
          await updatedClub.save();
        }
      }
    }

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
