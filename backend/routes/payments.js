const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { requireAuth } = require('../middleware/auth');
const PaidEventDetail = require('../models/PaidEventDetail');
const PaidRegistration = require('../models/PaidRegistration');
const Event = require('../models/Event');
const EventSubmission = require('../models/EventSubmission');

const razorpay = new Razorpay({
  key_id: (process.env.RAZORPAY_KEY_ID || '').trim(),
  key_secret: (process.env.RAZORPAY_KEY_SECRET || '').trim(),
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { eventId, eventModel, ticketsCount = 1 } = req.body;

    if (!eventId || !eventModel) {
      return res.status(400).json({ message: 'Missing event information' });
    }

    // 1. Check if user is already registered
    const EventModel = eventModel === 'Event' ? Event : EventSubmission;
    const event = await EventModel.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isAlreadyInRegisteredList = event.registeredUsers?.includes(req.user._id);

    const existingRegistration = await PaidRegistration.findOne({
      user: req.user._id,
      event: eventId,
      status: 'completed'
    });

    if (existingRegistration || isAlreadyInRegisteredList) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    // 2. Get Event Pricing Details
    const pricing = await PaidEventDetail.findOne({ event: eventId });
    if (!pricing) {
        return res.status(404).json({ message: 'Pricing details not found for this event' });
    }

    if (ticketsCount > pricing.maxTicketsPerUser) {
        return res.status(400).json({ message: `You can only purchase up to ${pricing.maxTicketsPerUser} tickets` });
    }

    const amount = Math.round(pricing.ticketPrice * ticketsCount * 100); // Amount in paise, rounded to integer

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid ticket price or count. Amount must be greater than zero.' });
    }

    // 3. Create Razorpay Order
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `rcpt_${req.user._id.toString().slice(-12)}_${Date.now().toString().slice(-6)}`,
    };

    console.log('Final Order Options:', options);

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpErr) {
      console.error('Razorpay SDK Order Creation Failure:', rzpErr);
      const errorMessage = rzpErr.description || rzpErr.message || 'Unknown Razorpay error';
      
      return res.status(502).json({ 
        message: 'Razorpay order creation failed: ' + errorMessage,
        code: rzpErr.code
      });
    }

    // 4. Create a pending registration record
    await PaidRegistration.create({
      user: req.user._id,
      event: eventId,
      eventModel: eventModel,
      razorpayOrderId: order.id,
      amount: pricing.ticketPrice * ticketsCount,
      ticketsCount: ticketsCount,
      customAnswers: req.body.customAnswers || [],
      status: 'pending'
    });

    res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('General Payment Order Error:', {
      message: error.message,
      stack: error.stack,
      body: req.body,
      userId: req.user?._id
    });
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid event identifier. This event may no longer exist.' });
    }

    res.status(500).json({ message: 'Error creating payment order: ' + (error.message || 'Unknown error') });
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify-payment
router.post('/verify-payment', requireAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      eventModel
    } = req.body;

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // 2. Update Registration Status
    const registration = await PaidRegistration.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration record not found' });
    }

    registration.status = 'completed';
    registration.razorpayPaymentId = razorpay_payment_id;
    registration.razorpaySignature = razorpay_signature;
    await registration.save();

    // 3. Add User to Event's Registered List
    const EventModel = eventModel === 'Event' ? Event : EventSubmission;
    const event = await EventModel.findById(eventId);
    if (event) {
        if (!event.registeredUsers.includes(req.user._id)) {
            event.registeredUsers.push(req.user._id);
            await event.save();
        }
    }

    res.json({ message: 'Payment verified and registration successful', registration });

  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

module.exports = router;
