const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { resend } = require('../utils/email');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { requireAuth, syncAdminRole } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

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
    age: user.age !== undefined && user.age !== null ? user.age : '',
    gender: user.gender || '',
    education: user.education || { collegeName: '', department: '', course: '', year: '' },
    hobbies: user.hobbies || [],
    interests: user.interests || [],
    phone: user.phone || '',
    authProvider: user.authProvider || 'local',
    hasCompletedProfile: user.hasCompletedProfile || false,
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
      from: `Eventum <support@theeventum.com>`,
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

    await resend.emails.send(mailOptions);
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
  const { userId, name, bio, avatar, phone, age, gender, interests, hobbies, favEvents, education } = req.body;
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

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (age !== undefined) user.age = (age === '' || age === null) ? undefined : Number(age);
    if (gender !== undefined) user.gender = gender;
    if (education !== undefined) {
      user.education = {
        collegeName: education.collegeName || '',
        department: education.department || '',
        course: education.course || '',
        year: education.year || ''
      };
    }
    if (interests !== undefined) user.interests = Array.isArray(interests) ? interests : [];
    if (hobbies !== undefined) user.hobbies = Array.isArray(hobbies) ? hobbies : [];
    if (favEvents !== undefined) user.favEvents = Array.isArray(favEvents) ? favEvents : [];
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
  const { userId, name, bio, avatar, phone, age, gender, interests, hobbies, favEvents, education } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (age !== undefined) user.age = (age === '' || age === null) ? undefined : Number(age);
    if (gender !== undefined) user.gender = gender;
    if (education !== undefined) {
      user.education = {
        collegeName: education.collegeName || '',
        department: education.department || '',
        course: education.course || '',
        year: education.year || ''
      };
    }
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
    const { name, bio, avatar, phone, age, gender, interests, hobbies, education } = req.body;
    if (name !== undefined && String(name).trim()) req.user.name = String(name).trim();
    if (bio !== undefined) req.user.bio = String(bio);
    if (avatar !== undefined) req.user.avatar = String(avatar);
    if (phone !== undefined) req.user.phone = String(phone);
    if (age !== undefined) req.user.age = (age === '' || age === null) ? undefined : Number(age);
    if (gender !== undefined) req.user.gender = String(gender);
    if (education !== undefined) {
      req.user.education = {
        collegeName: education.collegeName || '',
        department: education.department || '',
        course: education.course || '',
        year: education.year || ''
      };
    }
    if (interests !== undefined) req.user.interests = Array.isArray(interests) ? interests : [];
    if (hobbies !== undefined) req.user.hobbies = Array.isArray(hobbies) ? hobbies : [];

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

router.post('/verify-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ valid: false, message: 'Current password is required' });
    }
    if (req.user.authProvider === 'google') {
      return res.status(400).json({ valid: false, message: 'Google users do not have a password' });
    }
    
    // Fetch user with password field (since requireAuth excludes it via select('-password'))
    const dbUser = await User.findById(req.user._id);
    if (!dbUser) {
      return res.status(404).json({ valid: false, message: 'User not found' });
    }

    const isMatch = await dbUser.matchPassword(currentPassword);
    if (isMatch) {
      return res.status(200).json({ valid: true, message: 'Current password verified' });
    } else {
      return res.status(200).json({ valid: false, message: 'Incorrect current password' });
    }
  } catch (err) {
    res.status(500).json({ valid: false, message: err.message });
  }
});

router.patch('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Ensure the user is a local user
    if (req.user.authProvider === 'google') {
      return res.status(400).json({ message: 'Google users cannot change their password' });
    }

    const dbUser = await User.findById(req.user._id);
    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await dbUser.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    dbUser.password = newPassword; // Mongoose middleware will hash this
    await dbUser.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/forgot-password-send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const dbUser = await User.findOne({ email });
    if (!dbUser) return res.status(404).json({ message: 'User not found' });

    if (dbUser.authProvider === 'google') {
      return res.status(400).json({ message: 'Google users do not have a password' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    dbUser.otp = otp;
    dbUser.otpExpires = otpExpires;
    await dbUser.save();

    const mailOptions = {
      from: `Eventum <support@theeventum.com>`,
      to: dbUser.email,
      subject: 'Password Reset Code - Eventum',
      text: `Your OTP to reset your password is: ${otp}. It expires in 10 minutes.`,
      html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0a; padding: 40px 20px; color: #ffffff;">
        <div style="max-width: 450px; margin: 0 auto; background-color: #151515; border-radius: 12px; padding: 30px; border: 1px solid #2a2a2a; border-top: 3px solid #dc2626;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 8px 0;">Reset Your Password</h2>
            <p style="color: #a0a0a0; font-size: 14px; margin: 0;">Enter this verification code in Eventum to set a new password.</p>
          </div>
          <div style="background-color: #1c1c1c; border: 1px solid #333333; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <p style="color: #666666; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0; font-weight: 700;">Password Reset Code</p>
            <h1 style="color: #dc2626; font-size: 36px; letter-spacing: 6px; margin: 0; font-weight: 700;">${otp}</h1>
          </div>
          <p style="color: #777777; font-size: 12px; text-align: center; margin: 0;">Code expires in <span style="color: #dc2626; font-weight: 600;">10 minutes</span></p>
        </div>
      </div>
      `
    };

    try {
      await resend.emails.send(mailOptions);
    } catch (e) {
      console.error('Failed to send resend email:', e);
    }

    res.status(200).json({ message: `OTP sent to ${dbUser.email}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/forgot-password-verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ valid: false, message: 'Email and OTP are required' });

    const dbUser = await User.findOne({ email });
    if (!dbUser) return res.status(404).json({ valid: false, message: 'User not found' });

    if (dbUser.otp === otp && dbUser.otpExpires && dbUser.otpExpires > new Date()) {
      return res.status(200).json({ valid: true, message: 'OTP verified successfully' });
    } else {
      return res.status(200).json({ valid: false, message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    res.status(500).json({ valid: false, message: err.message });
  }
});

router.post('/reset-password-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Valid OTP and new password (min 6 chars) are required' });
    }

    const dbUser = await User.findOne({ email });
    if (!dbUser) return res.status(404).json({ message: 'User not found' });

    if (dbUser.otp !== otp || !dbUser.otpExpires || dbUser.otpExpires <= new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    dbUser.password = newPassword;
    dbUser.otp = undefined;
    dbUser.otpExpires = undefined;
    await dbUser.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/account', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: `Eventum <support@theeventum.com>`,
      to: email,
      subject: 'Verify your email - Eventum',
      text: `Your new OTP for registration is: ${otp}. It expires in 10 minutes.`,
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
            <h2 style="font-size: 22px; margin: 0 0 12px 0; color: #ffffff; font-weight: 600;">New Verification Code</h2>
            <p style="color: #a0a0a0; font-size: 14px; margin: 0; line-height: 1.5;">Enter this verification code in Eventum to securely sign in.</p>
          </div>
          <div style="background-color: #1c1c1c; border: 1px solid #333333; border-radius: 8px; padding: 25px; text-align: center; margin-bottom: 25px;">
            <p style="color: #666666; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; font-weight: 700;">Verification Code</p>
            <h1 style="color: #a855f7; font-size: 36px; letter-spacing: 6px; margin: 0; font-weight: 700; text-shadow: 0 0 10px rgba(168, 85, 247, 0.2);">${otp}</h1>
          </div>
          <div style="text-align: center;">
            <p style="color: #777777; font-size: 12px; margin: 0;">Code expires in <span style="color: #a855f7; font-weight: 600;">10 minutes</span></p>
          </div>
        </div>
      </div>
      `
    };

    await resend.emails.send(mailOptions);
    res.status(200).json({ message: 'New OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }
  res.json({ url: req.file.path });
});

module.exports = router;
