const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/contact
// Sends a contact query email
router.post('/', async (req, res) => {
  const { firstName, lastName, contactDetail, message } = req.body;

  if (!firstName || !contactDetail || !message) {
    return res.status(400).json({ error: 'Please fill out all required fields.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${firstName} ${lastName}" <${process.env.GMAIL_USER}>`, // Send via technical email
      to: 'theeventum01@gmail.com', // Destination support email
      subject: `New Contact Query from ${firstName}`,
      text: `
You have received a new contact query from Eventum.

Name: ${firstName} ${lastName}
Email/Phone: ${contactDetail}

Message:
${message}
      `,
      replyTo: contactDetail.includes('@') ? contactDetail : undefined // Allow replying directly if they provided an email
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact Email Error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
