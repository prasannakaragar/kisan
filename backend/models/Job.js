const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  worker_name: { type: String, required: true },
  worker_phone: { type: String, required: true },
  workers_count: { type: Number, default: 1 },
  message: { type: String, default: '' },
  applied_at: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  farmer_name: { type: String, required: true },
  farmer_phone: { type: String, required: true },
  village: { type: String, required: true },
  district: { type: String },
  state: { type: String, required: true },
  crop: { type: String },
  work_type: { type: String, required: true },
  workers_needed: { type: Number, required: true },
  workers_applied: { type: Number, default: 0 },
  wage_per_day: { type: Number, required: true },
  food_included: { type: Boolean, default: false },
  start_date: { type: String, required: true },
  end_date: { type: String },
  description: { type: String },
  status: { type: String, default: 'open' },
  posted_at: { type: Date, default: Date.now },
  applicants: [applicantSchema]
});

module.exports = mongoose.model('Job', jobSchema);
