const mongoose = require('mongoose');

const donationCampSchema = new mongoose.Schema({
    campName: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    contactPerson: { type: String, required: true },
    password: { type: String, required: true },
    bloodStock: { type: Object, default: null }, // Optional, default to null
});

module.exports = mongoose.model('DonationCamp', donationCampSchema);
