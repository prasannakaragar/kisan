require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Connect to MongoDB (supports both local and Atlas)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kisan';

console.log('🔌 Connecting to MongoDB...', MONGODB_URI.includes('mongodb+srv') ? '(Atlas Cloud)' : '(Local)');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ Connected to MongoDB Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.warn('⚠️ SERVER WARNING: Database not connected. Labour/Market/Barter will not work.');
    console.warn('   → For deployment, set MONGODB_URI to your MongoDB Atlas connection string.');
  });

const cropPricesRouter = require('./routes/cropPrices');
const schemesRouter = require('./routes/schemes');

const labourRouter = require('./routes/labour');
const marketplaceRouter = require('./routes/marketplace');
const barterRouter = require('./routes/barter');
const advisorRouter = require('./routes/advisor');
const fearRouter = require('./routes/fear');
const videosRouter = require('./routes/videos');
const financeRouter = require('./routes/finance');
const businessRouter = require('./routes/business');
const irrigationRouter = require('./routes/irrigation');
const subsidyRouter = require('./routes/subsidy');
const benefitsRouter = require('./routes/benefits');
const aiChatRouter = require('./routes/aiChat');


const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// More robust CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://kisan-wheat.vercel.app',
  'https://kisan-platform.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isLocal = origin.startsWith('http://localhost') || 
                   origin.startsWith('http://127.0.0.1') || 
                   origin.includes('192.168.') || 
                   origin.includes('10.');
                   
    const isVercel = origin.endsWith('.vercel.app');

    if (isLocal || isVercel || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('🚫 CORS Blocked Origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.use('/api/prices', cropPricesRouter);
app.use('/api/schemes', schemesRouter);

app.use('/api/labour', labourRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/barter', barterRouter);
app.use('/api/advisor', advisorRouter);
app.use('/api/fear', fearRouter);
app.use('/api/videos', videosRouter);
app.use('/api/finance', financeRouter);
app.use('/api/business', businessRouter);
app.use('/api/irrigation', irrigationRouter);
app.use('/api/subsidy', subsidyRouter);
app.use('/api/benefits', benefitsRouter);
app.use('/api/ai', aiChatRouter);

// Health check with DB status
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ 
    status: dbState === 1 ? 'ok' : 'degraded',
    database: states[dbState] || 'unknown',
    time: new Date() 
  });
});

// ─── Seed endpoint: Hit this ONCE after deployment to populate demo data ───
const Job = require('./models/Job');
const Listing = require('./models/Listing');
const Barter = require('./models/Barter');

app.post('/api/seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Check MONGODB_URI.' });
    }

    // Check if data already exists
    const jobCount = await Job.countDocuments();
    const listingCount = await Listing.countDocuments();
    const barterCount = await Barter.countDocuments();

    if (jobCount > 0 || listingCount > 0 || barterCount > 0) {
      return res.json({ 
        message: 'Data already exists!', 
        counts: { jobs: jobCount, listings: listingCount, barters: barterCount } 
      });
    }

    // 5 Labour posts
    const jobs = [
      {
        title: 'Paddy Harvesting Workers Needed',
        farmer_name: 'Rajesh Singh', farmer_phone: '9876543210',
        village: 'Kurali', district: 'Mohali', state: 'Punjab',
        crop: 'Paddy', work_type: 'Harvesting', workers_needed: 10,
        wage_per_day: 500, food_included: true, start_date: '2026-05-10',
        description: 'Need experienced workers for paddy harvesting. Accommodation will be provided.'
      },
      {
        title: 'Apple Picking Crew',
        farmer_name: 'Amit Negi', farmer_phone: '9888877777',
        village: 'Thanedhar', district: 'Shimla', state: 'Himachal Pradesh',
        crop: 'Apple', work_type: 'Picking', workers_needed: 15,
        wage_per_day: 600, food_included: false, start_date: '2026-08-15',
        description: 'Require energetic crew for apple picking season. Daily wages paid every evening.'
      },
      {
        title: 'Tea Garden Plantation Labours',
        farmer_name: 'Barua Tea Estate', farmer_phone: '9444455555',
        village: 'Jorhat', district: 'Jorhat', state: 'Assam',
        crop: 'Tea', work_type: 'Plantation', workers_needed: 20,
        wage_per_day: 400, food_included: true, start_date: '2026-06-01',
        description: 'Looking for plantation workers for seasonal tea leaf plucking.'
      },
      {
        title: 'General Farm Helper for Weeding',
        farmer_name: 'Suresh Patil', farmer_phone: '9123456789',
        village: 'Satana', district: 'Nashik', state: 'Maharashtra',
        crop: 'Grapes', work_type: 'Weeding', workers_needed: 5,
        wage_per_day: 450, food_included: true, start_date: '2026-05-20',
        description: 'Need help with weeding and general maintenance of grape vineyard.'
      },
      {
        title: 'Experienced Tractor Driver',
        farmer_name: 'Balwinder Dhillon', farmer_phone: '9999988888',
        village: 'Sirsa', district: 'Sirsa', state: 'Haryana',
        crop: 'Wheat', work_type: 'Tilling', workers_needed: 1,
        wage_per_day: 800, food_included: true, start_date: '2026-05-05',
        description: 'Seeking a skilled tractor driver for field preparation. Must know how to operate disc harrows.'
      }
    ];

    // 5 Market posts
    const listings = [
      {
        title: 'Mahindra 575 DI Tractor for Sale',
        category: 'equipment', sub_category: 'Tractor',
        price: 350000, is_negotiable: true,
        seller_name: 'Gurmukh Singh', seller_phone: '9777766666',
        village: 'Barnala', district: 'Sangrur', state: 'Punjab',
        description: '2019 model, well maintained, new tires. Only serious buyers contact.',
        condition: 'good'
      },
      {
        title: 'Organic Wheat Seeds - HD 2967',
        category: 'seeds', sub_category: 'Paddy Seeds',
        price: 45, is_negotiable: false,
        seller_name: 'Kisan Seed Store', seller_phone: '9222211111',
        village: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        description: 'High yield potential, certified organic seeds. Price per kg.',
        condition: 'new'
      },
      {
        title: '5HP Solar Irrigation Pump',
        category: 'equipment', sub_category: 'Pump Set',
        price: 45000, is_negotiable: true,
        seller_name: 'Vijay Deshmukh', seller_phone: '9333344444',
        village: 'Akola', district: 'Akola', state: 'Maharashtra',
        description: 'Submersible pump with controller. Used for 1 season only.',
        condition: 'good'
      },
      {
        title: 'Vermicompost / Organic Fertilizer',
        category: 'other', sub_category: 'Fertilizer',
        price: 8000, is_negotiable: true,
        seller_name: 'Eco Farms', seller_phone: '9000012345',
        village: 'Mysuru', district: 'Mysuru', state: 'Karnataka',
        description: 'High quality vermicompost. 1 ton available. Home delivery possible for nearby locations.',
        condition: 'new'
      },
      {
        title: 'Beehive Boxes (Set of 10)',
        category: 'other', sub_category: 'Tools',
        price: 15000, is_negotiable: false,
        seller_name: 'Honeybee Collective', seller_phone: '9111122222',
        village: 'Ranchi', district: 'Ranchi', state: 'Jharkhand',
        description: 'Standard size wooden beehive boxes with frames. Ready to use.',
        condition: 'good'
      }
    ];

    // 5 Barter posts
    const barters = [
      {
        farmer_name: 'Ram Charan', farmer_phone: '9444433333',
        village: 'Vasco', district: 'South Goa', state: 'Karnataka',
        have_crop: 'Rice', have_quantity: 5, have_unit: 'quintal',
        want_crop: 'Wheat', want_quantity: 4, want_unit: 'quintal',
        description: 'Looking to exchange high quality Basmati rice for Sharbati wheat.'
      },
      {
        farmer_name: 'Laxmi Devi', farmer_phone: '9555566666',
        village: 'Chitrakoot', district: 'Satna', state: 'Madhya Pradesh',
        have_crop: 'Onion', have_quantity: 2, have_unit: 'quintal',
        want_crop: 'Potato', want_quantity: 2, want_unit: 'quintal',
        description: 'Direct exchange of freshly harvested onions for potatoes.'
      },
      {
        farmer_name: 'Ramesh Reddy', farmer_phone: '9666677777',
        village: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh',
        have_crop: 'Chilli', have_quantity: 50, have_unit: 'kg',
        want_crop: 'Cotton', want_quantity: 20, want_unit: 'kg',
        description: 'Dried red chillies available for exchange with cotton seeds.'
      },
      {
        farmer_name: 'Savitri Bai', farmer_phone: '9777788888',
        village: 'Chamba', district: 'Chamba', state: 'Punjab',
        have_crop: 'Banana', have_quantity: 10, have_unit: 'quintal',
        want_crop: 'Groundnut', want_quantity: 5, want_unit: 'quintal',
        description: 'Fresh Nendran bananas for groundnut exchange.'
      },
      {
        farmer_name: 'Babu Lal', farmer_phone: '9888899999',
        village: 'Jaisalmer', district: 'Jaisalmer', state: 'Rajasthan',
        have_crop: 'Bajra', have_quantity: 3, have_unit: 'quintal',
        want_crop: 'Jowar', want_quantity: 3, want_unit: 'quintal',
        description: 'Exchange bajra (pearl millet) for jowar (sorghum).'
      }
    ];

    await Job.insertMany(jobs);
    await Listing.insertMany(listings);
    await Barter.insertMany(barters);

    res.json({ 
      success: true, 
      message: '✅ Seeded 15 demo posts!', 
      counts: { jobs: 5, listings: 5, barters: 5 } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(PORT, () => console.log(`Kisan Platform API running on port ${PORT}`));