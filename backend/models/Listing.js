const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  sub_category: { type: String },
  price: { type: Number, required: true },
  is_negotiable: { type: Boolean, default: true },
  seller_name: { type: String, required: true },
  seller_phone: { type: String, required: true },
  village: { type: String },
  district: { type: String },
  state: { type: String, required: true },
  description: { type: String },
  condition: { type: String, default: 'good' },
  posted_at: { type: Date, default: Date.now },
  status: { type: String, default: 'available' },
  views: { type: Number, default: 0 },
  images: [{ type: String }]
});

module.exports = mongoose.model('Listing', listingSchema);
