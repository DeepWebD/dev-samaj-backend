const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Authenticate Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization header missing or invalid format');
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer '
  console.log('Token received:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode token
    console.log('Token decoded successfully:', decoded);
    req.user = decoded; // Attach user info to the request object
    next(); // Proceed to the next middleware/route
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Fetch User Details
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body; // Default role to 'user'

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Error registering user.' });
  }
});


// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Login successful!',
        token,
        role: user.role,
        redirectUrl: user.role === 'admin' ? 'admin-home.html' : 'user-home.html',
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in.' });
  }
});


module.exports = router;

