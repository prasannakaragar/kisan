const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

const CATEGORIES = [
  { id: 'equipment', label: 'Equipment & Machinery', sub: ['Tractor', 'Pump Set', 'Irrigation', 'Harvester', 'Sprayer', 'Other'] },
  { id: 'seeds', label: 'Seeds & Saplings', sub: ['Paddy Seeds', 'Cotton Seeds', 'Vegetable Seeds', 'Fruit Saplings', 'Other'] },
  { id: 'livestock', label: 'Livestock', sub: ['Cow', 'Buffalo', 'Goat', 'Sheep', 'Poultry', 'Other'] },
  { id: 'produce', label: 'Farm Produce', sub: ['Grains', 'Vegetables', 'Fruits', 'Pulses', 'Spices', 'Other'] },
  { id: 'land', label: 'Land for Lease/Sale', sub: ['Agricultural Land', 'Farm Lease', 'Warehouse'] },
  { id: 'other', label: 'Other Farm Items', sub: ['Fertilizer', 'Pesticide', 'Tools', 'Other'] }
];

// GET /api/marketplace
router.get('/', async (req, res) => {
  try {
    const { category, state, district, search, min_price, max_price } = req.query;
    let query = { status: 'available' };

    if (category) query.category = category;
    if (state) query.state = { $regex: state, $options: 'i' };
    if (district) query.district = { $regex: district, $options: 'i' };
    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = parseInt(min_price);
      if (max_price) query.price.$lte = parseInt(max_price);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sub_category: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await Listing.find(query).sort({ posted_at: -1 });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/marketplace/categories
router.get('/categories', (req, res) => {
  res.json({ success: true, data: CATEGORIES });
});

// GET /api/marketplace/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id, 
      { $inc: { views: 1 } }, 
      { new: true }
    );
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace — create new listing
router.post('/', async (req, res) => {
  try {
    const { title, category, sub_category, price, is_negotiable, seller_name,
      seller_phone, village, district, state, description, condition } = req.body;

    if (!title || !category || !price || !seller_name || !seller_phone || !state) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const listing = new Listing({
      title, category, sub_category, price: parseInt(price),
      is_negotiable: Boolean(is_negotiable),
      seller_name, seller_phone, village, district, state,
      description, condition: condition || 'good'
    });

    await listing.save();
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/marketplace/:id/sold — mark as sold
router.patch('/:id/sold', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: 'sold' }, { new: true });
    if (!listing) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, message: 'Marked as sold', data: listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
