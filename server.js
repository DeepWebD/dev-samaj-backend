require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const bloodStockRoutes = require('./routes/bloodStock');  // Import blood stock routes
const eventRoutes = require('./routes/events');  // Import event routes
const bodyParser = require('body-parser');



dotenv.config();
const app = express(); // Initialize 'app' here

console.log('Event routes initialized');



app.use(bodyParser.json()); // To parse JSON in requests
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080', // Update this to your frontend's origin
  credentials: true,
}));

app.use(bloodStockRoutes); // Should pass the correct route, not an object
app.use(eventRoutes); // Should pass the correct route, not an object

const path = require('path');

// Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});
console.log("Testing", process.env.MONGO_URI)
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected 😊'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit app if MongoDB connection fails
  });

// Routes
const userRoutes = require('./routes/userRoutes');
const bloodBankRoutes = require('./routes/bloodBankRoutes');
const donorRoutes = require('./routes/donorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const bloodCampRoutes = require('./routes/bloodCampRoutes');

app.use('/api/bloodCamp', bloodCampRoutes);
app.use('/api/bloodRequests', bloodRequestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bloodBanks', bloodBankRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/users', userRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working fine!' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('U-Blood Backend Running');
});

// Server Listening
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
