const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Club = require('../models/Club');

let clubsCache = { data: null, timestamp: 0 };
const CLUBS_CACHE_TTL = 15000; // 15 seconds RAM cache

const clearClubsCache = () => {
  clubsCache = { data: null, timestamp: 0 };
};

// @desc    Get all clubs, initiatives, and organizations
// @route   GET /api/clubs
router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (clubsCache.data && (now - clubsCache.timestamp < CLUBS_CACHE_TTL)) {
      return res.json(clubsCache.data);
    }
    const clubs = await Club.find({}).sort({ name: 1 }).lean();
    clubsCache = { data: clubs, timestamp: now };
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get a specific club/initiative/organization by custom string ID or Mongo _id
// @route   GET /api/clubs/:id
router.get('/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let club = await Club.findOne({ id: param });
    if (!club && mongoose.Types.ObjectId.isValid(param)) {
      club = await Club.findById(param);
    }
    if (!club) {
      const cleanName = param.replace(/-/g, ' ');
      club = await Club.findOne({ name: new RegExp(cleanName, 'i') });
    }
    if (!club) {
      return res.status(404).json({ message: 'Club/Initiative/Organization not found' });
    }
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { router, clearClubsCache };
