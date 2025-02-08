// routes/events.js

const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

router.post('/api/events', async (req, res) => {
  console.log('POST /api/events hit');
  const { title, date, location } = req.body;

  try {
    const newEvent = new Event({
      title,
      date,
      location,
    });

    // Save the event to the database
    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error adding event', error });
  }
});

// Route to fetch upcoming events
router.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});



module.exports = router;
