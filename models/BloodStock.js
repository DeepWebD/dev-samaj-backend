const mongoose = require('mongoose');

// Blood Stock schema
const bloodStockSchema = new mongoose.Schema({
  bloodType: { type: String, required: true },
  units: { type: Number, required: true }
});

module.exports = mongoose.model('BloodStock', bloodStockSchema);
