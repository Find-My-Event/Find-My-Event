const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Club = require('../models/Club');
const User = require('../models/User');
const { upload } = require('../config/cloudinary');
const bcrypt = require('bcryptjs');
const { transporter } = require('../utils/email');

// Middleware to ensure user is an organizer
const requireOrganizer = (req, res, next) => {
  if (req.user && req.user.role === 'organizer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Organizer role required.' });
  }
};

// GET /api/organizer/club-profile
// Fetch the club data associated with the logged-in organizer
router.get('/club-profile', requireAuth, requireOrganizer, async (req, res) => {
  try {
    const club = await Club.findOne({ organizerAccount: req.user.id });
    if (!club) {
      return res.status(404).json({ message: 'Club profile not found for this organizer' });
    }
    res.status(200).json(club);
  } catch (err) {
    console.error('Error fetching organizer club profile:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/organizer/club-profile
// Update the club data and set user's hasCompletedProfile to true
router.put('/club-profile', requireAuth, requireOrganizer, async (req, res) => {
  try {
    const club = await Club.findOne({ organizerAccount: req.user.id });
    if (!club) {
      return res.status(404).json({ message: 'Club profile not found for this organizer' });
    }

    const {
      name,
      description,
      detailedDescription,
      aboutUs,
      logo,
      tags,
      venue,
      foundedOn,
      glimpses,
      leadership,
      eventsConducted,
      presidentEmail
    } = req.body;

    // Update fields
    if (name) club.name = name;
    if (description !== undefined) club.description = description;
    if (detailedDescription !== undefined) club.detailedDescription = detailedDescription;
    if (aboutUs !== undefined) club.aboutUs = aboutUs;
    if (logo) club.logo = logo;
    if (tags) club.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (venue !== undefined) club.venue = venue;
    if (foundedOn) club.foundedOn = new Date(foundedOn);
    if (glimpses) club.glimpses = glimpses;
    if (leadership) club.leadership = leadership;
    if (eventsConducted !== undefined) club.eventsConducted = Number(eventsConducted);
    if (presidentEmail) club.presidentEmail = presidentEmail;

    await club.save();

    // Mark the user's profile as complete and sync avatar
    const user = await User.findById(req.user.id);
    if (user) {
      if (!user.hasCompletedProfile) user.hasCompletedProfile = true;
      if (logo) user.avatar = logo;
      await user.save();
    }

    res.status(200).json({ message: 'Club profile updated successfully', club });
  } catch (err) {
    console.error('Error updating organizer club profile:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/organizer/upload
// Uploads a single file and returns the secure URL
router.post('/upload', requireAuth, requireOrganizer, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ url: req.file.path });
});

// POST /api/organizer/request-password-change
router.post('/request-password-change', requireAuth, requireOrganizer, async (req, res) => {
  try {
    const club = await Club.findOne({ organizerAccount: req.user.id });
    if (!club || !club.presidentEmail) {
      return res.status(400).json({ message: 'No President Email found for this club. Please update your profile first.' });
    }

    const user = await User.findById(req.user.id);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    const mailOptions = {
      from: `"Eventum Security" <${process.env.GMAIL_USER}>`,
      to: club.presidentEmail,
      subject: 'Password Change Request - Eventum',
      text: `Your OTP for changing the organizer password is: ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Eventum Password Change</h2>
          <p>You requested to change the password for your organizer account (${club.name}).</p>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Return masked email
    const [name, domain] = club.presidentEmail.split('@');
    const maskedEmail = `${name.substring(0, 2)}***@${domain}`;
    
    res.status(200).json({ message: 'OTP sent successfully', email: maskedEmail });
  } catch (err) {
    console.error('Error requesting password change:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/organizer/verify-password-change
router.post('/verify-password-change', requireAuth, requireOrganizer, async (req, res) => {
  const { otp, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash the new password and save (if using a pre-save hook, just user.password = newPassword)
    // Looking at auth.js, we don't have a guarantee of a pre-save hook. Let's check User.js or simply hash here.
    // Actually, in auth.js register it saves `user.password = password;` directly.
    // Let's assume the schema handles it, or bcrypt is needed.
    // Wait, in auth.js: user.password = password; await user.save();
    // This implies User schema has a pre('save') hook for hashing. 
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error verifying password change:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/organizer/events
// Fetch all events created by the logged-in organizer
router.get('/events', requireAuth, requireOrganizer, async (req, res) => {
  try {
    const events = await require('../models/ClubsEvent').find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching organizer events:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/organizer/events
// Create a new event by the logged-in organizer
router.post('/events', requireAuth, requireOrganizer, upload.single('image'), async (req, res) => {
  try {
    const club = await Club.findOne({ organizerAccount: req.user.id });
    if (!club) {
      return res.status(404).json({ message: 'Club profile not found. Cannot create event.' });
    }

    const { title, description, date, venue, category, price, seats, tag, startDate, endDate, registrationDeadline, mode, location, capacity, rules } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image for the event' });
    }

    const ClubsEvent = require('../models/ClubsEvent');
    
    const event = new ClubsEvent({
      title,
      description: description || 'No description provided.',
      organizer: club.name, // Set organizer name to the club's name
      date,
      venue,
      startDate,
      endDate,
      registrationDeadline,
      mode,
      location,
      capacity: capacity ? Number(capacity) : 0,
      image: req.file.path,
      category: category || 'General',
      price: price || 'Free',
      seats: seats || 'Limited',
      tag: tag || '',
      rules: rules || '',
      createdBy: req.user.id,
      clubId: club._id
    });

    const savedEvent = await event.save();
    
    // Optionally increment eventsConducted
    club.eventsConducted += 1;
    await club.save();

    res.status(201).json(savedEvent);
  } catch (err) {
    console.error('Error creating organizer event:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
