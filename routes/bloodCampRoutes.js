const express = require('express');
const router = express.Router();
const DonationCamp = require('../models/DonationCamp'); // Import the schema
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new donation camp
router.post('/register', async (req, res) => {
    const { campName, location, email, contactNumber, contactPerson, password } = req.body;

    try {
        // Check if email is already registered
        const existingCamp = await DonationCamp.findOne({ email });
        if (existingCamp) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new camp
        const newCamp = new DonationCamp({
            campName,
            location,
            email,
            contactNumber,
            contactPerson,
            password: hashedPassword,
            bloodStock: null, // Default to null on registration
        });

        await newCamp.save();
        res.status(201).json({ message: 'Camp registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login for donation camp
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the camp by email
        const camp = await DonationCamp.findOne({ email });
        if (!camp) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, camp.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a token
        const token = jwt.sign({ id: camp._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/updateBloodStock/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { bloodStock } = req.body;

        const updatedCamp = await DonationCamp.findByIdAndUpdate(
            id,
            { bloodStock },
            { new: true }
        );
        res.status(200).json({ message: 'Blood stock updated', updatedCamp });
    } catch (error) {
        res.status(500).json({ message: 'Error updating blood stock', error });
    }
});

router.get('/donors', async (req, res) => {
    const { location } = req.query;
    try {
        const donors = await Donor.find({ location });
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donors', error });
    }
});

router.get('/bloodRequests', async (req, res) => {
    const { location } = req.query;
    try {
        const requests = await BloodRequest.find({ location });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blood requests', error });
    }
});

router.get('/bloodStock/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const camp = await DonationCamp.findById(id);
        res.status(200).json(camp.bloodStock);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blood stock', error });
    }
});


module.exports = router;
