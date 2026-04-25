const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const Listing = require('./models/Listing');
const Barter = require('./models/Barter');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kisan';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Labours (Job) - 5 Examples
    const jobs = [
      {
        title: 'Paddy Harvesting Workers Needed',
        farmer_name: 'Rajesh Singh',
        farmer_phone: '9876543210',
        village: 'Kurali',
        district: 'Mohali',
        state: 'Punjab',
        crop: 'Paddy',
        work_type: 'Harvesting',
        workers_needed: 10,
        wage_per_day: 500,
        food_included: true,
        start_date: '2026-05-10',
        description: 'Need experienced workers for paddy harvesting. Accommodation will be provided.'
      },
      {
        title: 'Apple Picking Crew',
        farmer_name: 'Amit Negi',
        farmer_phone: '9888877777',
        village: 'Thanedhar',
        district: 'Shimla',
        state: 'Himachal Pradesh',
        crop: 'Apple',
        work_type: 'Picking',
        workers_needed: 15,
        wage_per_day: 600,
        food_included: false,
        start_date: '2026-08-15',
        description: 'Require energetic crew for apple picking season. Daily wages paid every evening.'
      },
      {
        title: 'Tea Garden Plantation Labours',
        farmer_name: 'Barua Tea Estate',
        farmer_phone: '9444455555',
        village: 'Jorhat',
        district: 'Jorhat',
        state: 'Assam',
        crop: 'Tea',
        work_type: 'Plantation',
        workers_needed: 20,
        wage_per_day: 400,
        food_included: true,
        start_date: '2026-06-01',
        description: 'Looking for plantation workers for seasonal tea leaf plucking.'
      },
      {
        title: 'General Farm Helper for Weeding',
        farmer_name: 'Suresh Patil',
        farmer_phone: '9123456789',
        village: 'Satana',
        district: 'Nashik',
        state: 'Maharashtra',
        crop: 'Grapes',
        work_type: 'Weeding',
        workers_needed: 5,
        wage_per_day: 450,
        food_included: true,
        start_date: '2026-05-20',
        description: 'Need help with weeding and general maintenance of grape vineyard.'
      },
      {
        title: 'Experienced Tractor Driver',
        farmer_name: 'Balwinder Dhillon',
        farmer_phone: '9999988888',
        village: 'Sirsa',
        district: 'Sirsa',
        state: 'Haryana',
        crop: 'Wheat',
        work_type: 'Tilling',
        workers_needed: 1,
        wage_per_day: 800,
        food_included: true,
        start_date: '2026-05-05',
        description: 'Seeking a skilled tractor driver for field preparation. Must know how to operate disc harrows.'
      }
    ];

    // 2. Market (Listing) - 5 Examples
    const listings = [
      {
        title: 'Mahindra 575 DI Tractor for Sale',
        category: 'Machinery',
        sub_category: 'Tractors',
        price: 350000,
        is_negotiable: true,
        seller_name: 'Gurmukh Singh',
        seller_phone: '9777766666',
        village: 'Barnala',
        district: 'Sangrur',
        state: 'Punjab',
        description: '2019 model, well maintained, new tires. Only serious buyers contact.',
        condition: 'good'
      },
      {
        title: 'Organic Wheat Seeds - HD 2967',
        category: 'Seeds',
        sub_category: 'Cereals',
        price: 45,
        is_negotiable: false,
        seller_name: 'Kisan Seed Store',
        seller_phone: '9222211111',
        village: 'Indore',
        district: 'Indore',
        state: 'Madhya Pradesh',
        description: 'High yield potential, certified organic seeds. Price per kg.',
        condition: 'new'
      },
      {
        title: '5HP Solar Irrigation Pump',
        category: 'Equipment',
        sub_category: 'Pumps',
        price: 45000,
        is_negotiable: true,
        seller_name: 'Vijay Deshmukh',
        seller_phone: '9333344444',
        village: 'Akola',
        district: 'Akola',
        state: 'Maharashtra',
        description: 'Submersible pump with controller. Used for 1 season only.',
        condition: 'excellent'
      },
      {
        title: 'Vermicompost / Organic Fertilizer',
        category: 'Fertilizers',
        sub_category: 'Organic',
        price: 8000,
        is_negotiable: true,
        seller_name: 'Eco Farms',
        seller_phone: '9000012345',
        village: 'Mysuru',
        district: 'Mysuru',
        state: 'Karnataka',
        description: 'High quality vermicompost. 1 ton available. Home delivery possible for nearby locations.',
        condition: 'new'
      },
      {
        title: 'Beehive Boxes (Set of 10)',
        category: 'Tools',
        sub_category: 'Beekeeping',
        price: 15000,
        is_negotiable: false,
        seller_name: 'Honeybee Collective',
        seller_phone: '9111122222',
        village: 'Ranchi',
        district: 'Ranchi',
        state: 'Jharkhand',
        description: 'Standard size wooden beehive boxes with frames. Ready to use.',
        condition: 'good'
      }
    ];

    // 3. Barter - 5 Examples
    const barters = [
      {
        farmer_name: 'Ram Charan',
        farmer_phone: '9444433333',
        village: 'Vasco',
        district: 'South Goa',
        state: 'Goa',
        have_crop: 'Rice',
        have_quantity: 5,
        have_unit: 'quintal',
        want_crop: 'Wheat',
        want_quantity: 4,
        want_unit: 'quintal',
        description: 'Looking to exchange high quality Basmati rice for Sharbati wheat.'
      },
      {
        farmer_name: 'Laxmi Devi',
        farmer_phone: '9555566666',
        village: 'Chitrakoot',
        district: 'Satna',
        state: 'Madhya Pradesh',
        have_crop: 'Onion',
        have_quantity: 2,
        have_unit: 'quintal',
        want_crop: 'Potato',
        want_quantity: 2,
        want_unit: 'quintal',
        description: 'Direct exchange of freshly harvested onions for potatoes.'
      },
      {
        farmer_name: 'Ramesh Reddy',
        farmer_phone: '9666677777',
        village: 'Guntur',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        have_crop: 'Chilli',
        have_quantity: 50,
        have_unit: 'kg',
        want_crop: 'Cotton Seeds',
        want_quantity: 20,
        want_unit: 'kg',
        description: 'Dried red chillies available for exchange with Bt Cotton seeds.'
      },
      {
        farmer_name: 'Savitri Bai',
        farmer_phone: '9777788888',
        village: 'Chamba',
        district: 'Chamba',
        state: 'Himachal Pradesh',
        have_crop: 'Honey',
        have_quantity: 10,
        have_unit: 'kg',
        want_crop: 'Ghee',
        want_quantity: 5,
        want_unit: 'kg',
        description: 'Pure forest honey for homemade cow ghee.'
      },
      {
        farmer_name: 'Babu Lal',
        farmer_phone: '9888899999',
        village: 'Jaisalmer',
        district: 'Jaisalmer',
        state: 'Rajasthan',
        have_crop: 'Cow Dung Cakes',
        have_quantity: 500,
        have_unit: 'pieces',
        want_crop: 'Firewood',
        want_quantity: 1,
        want_unit: 'quintal',
        description: 'Exchange dry cow dung cakes for firewood for winter.'
      }
    ];

    // Clear existing data (optional, but good for testing)
    await Job.deleteMany({});
    await Listing.deleteMany({});
    await Barter.deleteMany({});

    // Insert new data
    await Job.insertMany(jobs);
    await Listing.insertMany(listings);
    await Barter.insertMany(barters);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
