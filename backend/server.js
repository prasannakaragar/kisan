require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kisan';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    console.warn('⚠️ SERVER WARNING: Database not connected. Post features will not work.');
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


app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(PORT, () => console.log(`Kisan Platform API running on port ${PORT}`));