require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    const adminEmail = 'admin@findmyevent.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('Admin already exists. Updating to ensure correct role and password...');
      adminExists.role = 'admin';
      adminExists.password = 'admin123';
      adminExists.isVerified = true;
      adminExists.hasCompletedProfile = true;
      await adminExists.save();
      console.log('Admin updated successfully.');
    } else {
      const admin = new User({
        name: 'Main Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        isVerified: true,
        hasCompletedProfile: true,
        bio: 'Super administrator of Find My Event.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      });
      await admin.save();
      console.log('Admin user created successfully.');
    }

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
