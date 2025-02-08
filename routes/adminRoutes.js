const express = require('express');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const BloodBank = require('../models/bloodBank');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
// const donor = require('../models/donor');

const router = express.Router();


// Fetch all users for Manage Users page
router.get('/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


// Manage blood banks (Already existing)
router.get('/blood-banks', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find();
    res.status(200).json(bloodBanks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch blood banks' });
  }
});

module.exports = router;
