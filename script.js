const fs = require('fs');
let content = fs.readFileSync('backend/routes/events.js', 'utf8');

const startIndex = content.indexOf("router.get('/registered', requireAuth, async (req, res) => {");
if (startIndex === -1) { console.error('Start index not found'); process.exit(1); }

let endIndex = content.indexOf("});", startIndex);
endIndex = content.indexOf("});", endIndex + 1); // Get the closing of the route
endIndex += 3; // include });

const newRoute = `router.get('/registered', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Gather all explicit registrations
    const [freeRegs, paidRegs] = await Promise.all([
      Registration.find({ user: userId }).lean(),
      PaidRegistration.find({ user: userId, status: 'completed' }).lean()
    ]);

    const eventIds = new Set();
    const submissionIds = new Set();
    const clubEventIds = new Set();

    const categorizeReg = (r) => {
      if (!r.event) return;
      const id = r.event.toString();
      const model = r.eventModel || 'Event';
      if (model === 'Event') eventIds.add(id);
      else if (model === 'EventSubmission') submissionIds.add(id);
      else if (model === 'ClubsEvent') clubEventIds.add(id);
    };

    freeRegs.forEach(categorizeReg);
    paidRegs.forEach(categorizeReg);

    // 2. Also get any events where user is in registeredUsers directly
    const [eventsByArray, submissionsByArray, clubsByArray] = await Promise.all([
      Event.find({ registeredUsers: userId }).lean(),
      EventSubmission.find({ registeredUsers: userId }).lean(),
      ClubsEvent.find({ registeredUsers: userId }).lean()
    ]);

    eventsByArray.forEach(e => eventIds.add(e._id.toString()));
    submissionsByArray.forEach(e => submissionIds.add(e._id.toString()));
    clubsByArray.forEach(e => clubEventIds.add(e._id.toString()));

    // 3. Fetch all combined unique events
    const [events, submissions, clubsEvents] = await Promise.all([
      Event.find({ _id: { $in: Array.from(eventIds) } }).lean(),
      EventSubmission.find({ _id: { $in: Array.from(submissionIds) } }).lean(),
      ClubsEvent.find({ _id: { $in: Array.from(clubEventIds) } }).lean()
    ]);

    // 4. Map them all and generate QR tokens
    const mappedSubmissions = await Promise.all(submissions.map(async (s) => {
      const pricing = await PaidEventDetail.findOne({ event: s._id }).lean();
      const qrToken = jwt.sign({ userId, eventId: s._id, model: 'EventSubmission' }, process.env.JWT_SECRET || 'secret');
      return { ...s, date: s.startDate, venue: s.location, image: s.imageUrl, category: s.category || 'Special', pricing, qrToken };
    }));

    const eventsWithPricing = await Promise.all(events.map(async (e) => {
      const pricing = await PaidEventDetail.findOne({ event: e._id }).lean();
      const qrToken = jwt.sign({ userId, eventId: e._id, model: 'Event' }, process.env.JWT_SECRET || 'secret');
      return { ...e, pricing, qrToken };
    }));

    const mappedClubsEvents = await Promise.all(clubsEvents.map(async (c) => {
      const pricing = await PaidEventDetail.findOne({ event: c._id }).lean();
      const qrToken = jwt.sign({ userId, eventId: c._id, model: 'ClubsEvent' }, process.env.JWT_SECRET || 'secret');
      return { ...c, date: c.startDate, venue: c.location, image: c.image || c.imageUrl, category: c.category || 'Club Event', pricing, qrToken };
    }));

    const combined = [...eventsWithPricing, ...mappedSubmissions, ...mappedClubsEvents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});`;

content = content.substring(0, startIndex) + newRoute + content.substring(endIndex);
fs.writeFileSync('backend/routes/events.js', content);
console.log('Done!');
