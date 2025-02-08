const express = require('express');
const BloodStock = require('../models/BloodStock');
const router = express.Router();

// Route to fetch blood stock levels
router.get('/api/blood-stock', async (req, res) => {
  try {
    const stock = await BloodStock.find();
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blood stock levels', error });
  }
});

router.put('/api/blood-stock/:bloodType', async (req, res) => {
  const { bloodType } = req.params;
  const { units } = req.body;

  try {
    // Find the blood stock entry by blood type and update its quantity
    const updatedStock = await BloodStock.findOneAndUpdate(
      { bloodType },
      { $set: { units } },
      { new: true, upsert: true } // `upsert: true` creates the entry if it doesn't exist
    );

    res.status(200).json({ message: 'Blood stock updated successfully', stock: updatedStock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating blood stock', error });
  }
});

module.exports = router;
