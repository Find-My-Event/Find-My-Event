const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Event = require('../models/Event');
const User = require('../models/User');

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding events...');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('Admin user not found. Please run seedAdmin.js first.');
      process.exit(1);
    }

    const events = [
      {
        title: 'National Healthcare Hackathon 2.0',
        description: 'A premier hackathon focused on solving real-world healthcare challenges using cutting-edge technology. Collaborate with medical professionals and tech experts.',
        organizer: 'JECRC University',
        date: 'Oct 12, 2024 • 9:00 AM PST',
        venue: 'Moscone Center, SF / Hybrid',
        image: '/event1.png',
        category: 'Tech',
        price: 'Free',
        seats: '500',
        tag: 'Trending',
        createdBy: admin._id
      },
      {
        title: 'Hukum Holi Fest',
        description: 'Experience the colors and sounds of the biggest Holi festival on campus. Featuring top DJs, organic colors, and traditional snacks.',
        organizer: 'JECRC University',
        date: 'Oct 20, 2024 • 10:00 AM PST',
        venue: 'Ground Zero Park',
        image: '/event2.png',
        category: 'Music',
        price: '$15',
        seats: '1000',
        tag: 'Hot',
        createdBy: admin._id
      },
      {
        title: 'Code Sparks: Intro to Python',
        description: 'Kickstart your coding journey with this hands-on Python workshop. Perfect for beginners who want to learn the basics of logic and programming.',
        organizer: 'Tech Innovators',
        date: 'Oct 15, 2024 • 11:00 AM PST',
        venue: 'Virtual / Zoom',
        image: '/event1.png',
        category: 'Tech',
        price: 'Free',
        seats: '100',
        tag: 'New',
        createdBy: admin._id
      },
      {
        title: 'InnovateX Business Pitch',
        description: 'Pitch your startup idea to a panel of experts and venture capitalists. Win exciting prizes and get a chance for mentorship.',
        organizer: 'Entrepreneurship Cell',
        date: 'Nov 5, 2024 • 2:00 PM PST',
        venue: 'Auditorium A',
        image: '/event2.png',
        category: 'Workshops',
        price: 'Free',
        seats: '200',
        tag: 'Trending',
        createdBy: admin._id
      }
    ];

    // Clear existing events to avoid duplicates if needed, 
    // or just check for existence. Here we'll just insert them.
    for (const eventData of events) {
      const exists = await Event.findOne({ title: eventData.title });
      if (!exists) {
        await Event.create(eventData);
        console.log(`Seeded event: ${eventData.title}`);
      } else {
        console.log(`Event already exists: ${eventData.title}`);
      }
    }

    console.log('Seeding completed successfully.');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding events:', err);
    process.exit(1);
  }
};

seedEvents();
