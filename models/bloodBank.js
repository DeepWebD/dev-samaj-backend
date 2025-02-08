const mongoose = require('mongoose');

const BloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  availableBloodTypes: [String], // List of blood types available
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BloodBank', BloodBankSchema);