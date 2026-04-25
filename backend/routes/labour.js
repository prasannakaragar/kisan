const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET /api/labour/jobs
router.get('/jobs', async (req, res) => {
  try {
    const { state, district, work_type, crop } = req.query;
    let query = { status: 'open' };

    if (state) query.state = { $regex: state, $options: 'i' };
    if (district) query.district = { $regex: district, $options: 'i' };
    if (work_type) query.work_type = { $regex: work_type, $options: 'i' };
    if (crop) query.crop = { $regex: crop, $options: 'i' };

    const jobs = await Job.find(query).sort({ posted_at: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/labour/jobs — post a new job
router.post('/jobs', async (req, res) => {
  try {
    const { title, farmer_name, farmer_phone, village, district, state, crop,
      work_type, workers_needed, wage_per_day, food_included, start_date, end_date, description } = req.body;

    if (!farmer_name || !farmer_phone || !village || !state || !workers_needed || !wage_per_day || !start_date) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const job = new Job({
      title: title || `${work_type} workers needed in ${village}`,
      farmer_name, farmer_phone, village, district, state, crop,
      work_type, workers_needed: parseInt(workers_needed),
      wage_per_day: parseInt(wage_per_day),
      food_included: Boolean(food_included),
      start_date, end_date, description
    });

    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/labour/jobs/:id/apply — worker applies for a job
router.post('/jobs/:id/apply', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'open') return res.status(400).json({ error: 'Job is no longer accepting applications' });

    const { worker_name, worker_phone, workers_count, message } = req.body;
    if (!worker_name || !worker_phone) return res.status(400).json({ error: 'Name and phone required' });

    const application = {
      worker_name, worker_phone,
      workers_count: parseInt(workers_count) || 1,
      message: message || ''
    };

    job.applicants.push(application);
    job.workers_applied = job.applicants.length;
    
    if (job.workers_applied >= job.workers_needed) {
      job.status = 'filled';
    }

    await job.save();
    res.status(201).json({ 
      success: true, 
      message: `Application submitted! ${job.farmer_name} will contact you at ${worker_phone}`, 
      data: application 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/labour/work-types
router.get('/work-types', (req, res) => {
  res.json({ success: true, data: ['Harvesting', 'Planting', 'Weeding', 'Spraying', 'Irrigation', 'Land Preparation', 'Sorting & Packing', 'Transport'] });
});

module.exports = router;
