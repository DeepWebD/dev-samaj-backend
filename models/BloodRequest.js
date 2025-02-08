const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, required: true },
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Fulfilled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
