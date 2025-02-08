const express = require('express');
const BloodBank = require('../models/bloodBank');
const authenticate = require('../middleware/authenticate'); // For protected routes

const router = express.Router();

// Add a new blood bank (admin-only for now)
router.post('/add', authenticate, async (req, res) => {
  try {
    const { name, location, contactNumber, availableBloodTypes } = req.body;

    const bloodBank = new BloodBank({
      name,
      location,
      contactNumber,
      availableBloodTypes,
    });

    await bloodBank.save();
    res.status(201).json({ message: 'Blood bank added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while adding blood bank' });
  }
});

// Search for blood banks by name or location
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // e.g., ?query=New York
    const bloodBanks = await BloodBank.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json(bloodBanks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while searching blood banks' });
  }
});

module.exports = router;