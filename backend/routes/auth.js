const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { transporter } = require('../utils/email');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { requireAuth, syncAdminRole } = require('../middleware/auth');

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    avatar: user.avatar || '',
    role: user.role || 'user',
    notifyEmail: user.notifyEmail !== false,
    publicProfile: user.publicProfile !== false,
    favEvents: user.favEvents || [],
    age: user.age,
    gender: user.gender,
    hobbies: user.hobbies || [],
    interests: user.interests || [],
  };
}

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (!user) {
      user = new User({ name, email, password, otp, otpExpires });
    } else {
      user.name = name;
      user.password = password;
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    const mailOptions = {
      from: `"Eventum" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify your email - Eventum',
      text: `Your OTP for registration is: ${otp}. It expires in 10 minutes.`,
      html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0a; padding: 60px 20px; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700; letter-spacing: 1px;">
            Eventum <span style="color: #a855f7;">●</span>
          </h1>
        </div>
        
        <div style="max-width: 450px; margin: 0 auto; background-color: #151515; border-radius: 12px; padding: 40px 30px; border: 1px solid #2a2a2a; border-top: 3px solid #a855f7;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 28px; margin-bottom: 15px;">🔒</div>
            <h2 style="font-size: 22px; margin: 0 0 12px 0; color: #ffffff; font-weight: 600;">Verify your email</h2>
            <p style="color: #a0a0a0; font-size: 14px; margin: 0; line-height: 1.5;">Enter this verification code in Eventum to securely sign in.</p>
          </div>

          <div style="background-color: #1c1c1c; border: 1px solid #333333; border-radius: 8px; padding: 25px; text-align: center; margin-bottom: 25px;">
            <p style="color: #666666; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; font-weight: 700;">Verification Code</p>
            <h1 style="color: #a855f7; font-size: 36px; letter-spacing: 6px; margin: 0; font-weight: 700; text-shadow: 0 0 10px rgba(168, 85, 247, 0.2);">${otp}</h1>
          </div>

          <div style="text-align: center;">
            <p style="color: #777777; font-size: 12px; margin: 0;">
              Code expires in <span style="color: #a855f7; font-weight: 600;">10 minutes</span>
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <p style="color: #444444; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Eventum. Connect. Discover.</p>
        </div>
      </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    await syncAdminRole(user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const fresh = await User.findById(user._id).select('-password');
    res.status(200).json({ token, user: userResponse(fresh) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route: Setup Profile (Initial)
router.post('/setup-profile', async (req, res) => {
  console.log('DEBUG: Setup Profile Request Body:', req.body);
  const { userId, bio, avatar, age, gender, interests, hobbies, favEvents } = req.body;
  try {
    if (!userId) {
      console.error('DEBUG: userId is missing in request');
      return res.status(400).json({ message: 'User ID is missing' });
    }
    const user = await User.findById(userId);
    if (!user) {
      console.error('DEBUG: User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;
    user.age = age;
    user.gender = gender;
    user.interests = interests || [];
    user.hobbies = hobbies || [];
    user.favEvents = favEvents || [];
    user.hasCompletedProfile = true;

    await user.save();
    const fresh = await User.findById(user._id).select('-password');
    res.status(200).json({ user: userResponse(fresh) });
  } catch (err) {
    console.error('Setup Profile Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Route: Update Profile (Editing)
router.put('/update-profile', async (req, res) => {
  console.log('DEBUG: Update Profile Request Body:', req.body);
  const { userId, name, bio, avatar, age, gender, interests, hobbies, favEvents } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (interests !== undefined) user.interests = interests;
    if (hobbies !== undefined) user.hobbies = hobbies;
    if (favEvents !== undefined) user.favEvents = favEvents;

    await user.save();
    const fresh = await User.findById(user._id).select('-password');
    res.status(200).json({ user: userResponse(fresh) });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found. Please create an account first.' });

    if (!user.isVerified) return res.status(401).json({ message: 'Email not verified. Please register again.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    await syncAdminRole(user);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const fresh = await User.findById(user._id).select('-password');
    res.status(200).json({ token, user: userResponse(fresh) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    await syncAdminRole(user);
    const fresh = await User.findById(decoded.id).select('-password');
    res.status(200).json(userResponse(fresh));
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    if (name !== undefined && String(name).trim()) req.user.name = String(name).trim();
    if (bio !== undefined) req.user.bio = String(bio);
    if (avatar !== undefined) req.user.avatar = String(avatar);
    await req.user.save();
    const fresh = await User.findById(req.user._id).select('-password');
    res.json({ user: userResponse(fresh) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/settings', requireAuth, async (req, res) => {
  try {
    const { notifyEmail, publicProfile } = req.body;
    if (typeof notifyEmail === 'boolean') req.user.notifyEmail = notifyEmail;
    if (typeof publicProfile === 'boolean') req.user.publicProfile = publicProfile;
    await req.user.save();
    const fresh = await User.findById(req.user._id).select('-password');
    res.json({ user: userResponse(fresh) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
