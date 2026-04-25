const express = require('express');
const router = express.Router();
const Barter = require('../models/Barter');

const CROPS = ['Rice','Wheat','Maize','Jowar','Bajra','Toor Dal','Chana Dal','Moong Dal','Groundnut','Sunflower Seeds','Cotton','Soybean','Mustard','Sugarcane','Potato','Onion','Tomato','Chilli','Turmeric','Ginger','Coconut','Banana'];
const UNITS = ['quintal', 'kg', 'tonne', 'bag (50kg)'];
const STATES = ['Karnataka','Maharashtra','Punjab','Andhra Pradesh','Tamil Nadu','Uttar Pradesh','Bihar','Rajasthan','Madhya Pradesh','Gujarat'];

router.get('/crops', (req, res) => res.json({ success: true, data: CROPS }));
router.get('/units', (req, res) => res.json({ success: true, data: UNITS }));
router.get('/states', (req, res) => res.json({ success: true, data: STATES }));

router.get('/', async (req, res) => {
  try {
    const { state, have_crop, want_crop } = req.query;
    let query = { status: 'open' };

    if (state) query.state = { $regex: state, $options: 'i' };
    if (have_crop) query.have_crop = { $regex: have_crop, $options: 'i' };
    if (want_crop) query.want_crop = { $regex: want_crop, $options: 'i' };

    const listings = await Barter.find(query).sort({ posted_at: -1 });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmer_name, farmer_phone, village, district, state, have_crop, have_quantity, have_unit, want_crop, want_quantity, want_unit, description } = req.body;
    
    if (!farmer_name || !farmer_phone || !state || !have_crop || !want_crop) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const listing = new Barter({
      farmer_name, farmer_phone, village, district, state,
      have_crop, have_quantity: parseFloat(have_quantity) || 1, have_unit: have_unit || 'quintal',
      want_crop, want_quantity: parseFloat(want_quantity) || 1, want_unit: want_unit || 'quintal',
      description: description || ''
    });

    await listing.save();
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/close', async (req, res) => {
  try {
    const listing = await Barter.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
    if (!listing) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, message: 'Barter listing closed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
