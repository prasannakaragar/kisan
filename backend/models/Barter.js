const mongoose = require('mongoose');

const barterSchema = new mongoose.Schema({
  farmer_name: { type: String, required: true },
  farmer_phone: { type: String, required: true },
  village: { type: String },
  district: { type: String },
  state: { type: String, required: true },
  have_crop: { type: String, required: true },
  have_quantity: { type: Number, default: 1 },
  have_unit: { type: String, default: 'quintal' },
  want_crop: { type: String, required: true },
  want_quantity: { type: Number, default: 1 },
  want_unit: { type: String, default: 'quintal' },
  description: { type: String },
  status: { type: String, default: 'open' },
  posted_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Barter', barterSchema);
