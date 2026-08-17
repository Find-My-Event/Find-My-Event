const express = require('express');
const router = express.Router();
const Club = require('../models/Club');

let clubsCache = { data: null, timestamp: 0 };
const CLUBS_CACHE_TTL = 15000; // 15 seconds RAM cache

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

// @desc    Get a specific club/initiative/organization by custom string ID
// @route   GET /api/clubs/:id
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findOne({ id: req.params.id });
    if (!club) {
      return res.status(404).json({ message: 'Club/Initiative/Organization not found' });
    }
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
