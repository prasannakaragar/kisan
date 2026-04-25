const express = require('express');
const router = express.Router();
const { SCHEMES } = require('./schemes');
const { SUBSIDIES } = require('./subsidy');

// Metadata for both
const STATES = [
    'All India', 'Karnataka', 'Maharashtra', 'Punjab', 'Andhra Pradesh',
    'Telangana', 'Tamil Nadu', 'Madhya Pradesh', 'Uttar Pradesh', 'Rajasthan',
    'Gujarat', 'Haryana', 'Bihar', 'West Bengal',
];

const CATEGORIES = [
    { id: 'income_support', label: '💰 Income Support', type: 'scheme' },
    { id: 'insurance', label: '🛡️ Crop Insurance', type: 'scheme' },
    { id: 'pension', label: '👴 Farmer Pension', type: 'scheme' },
    { id: 'irrigation', label: '💧 Irrigation & Drip', type: 'subsidy' },
    { id: 'mechanization', label: '🚜 Farm Machinery', type: 'subsidy' },
    { id: 'solar', label: '☀️ Solar Energy', type: 'subsidy' },
    { id: 'storage', label: '🏭 Storage & Warehouse', type: 'subsidy' },
    { id: 'seeds', label: '🌱 Seeds & Inputs', type: 'subsidy' },
    { id: 'horticulture', label: '🍎 Horticulture', type: 'subsidy' },
    { id: 'fisheries', label: '🐟 Fisheries', type: 'scheme' },
    { id: 'energy', label: '⚡ Biogas & Energy', type: 'subsidy' },
];

router.get('/meta', (req, res) => {
    res.json({
        success: true,
        data: {
            states: STATES,
            categories: CATEGORIES,
        }
    });
});

router.get('/', (req, res) => {
    try {
        const { state, category, search, type } = req.query;
        
        let allBenefits = [
            ...SCHEMES.map(s => ({ ...s, benefit_type_group: 'scheme' })),
            ...SUBSIDIES.map(s => ({ ...s, benefit_type_group: 'subsidy' }))
        ];

        if (state && state !== 'All India') {
            allBenefits = allBenefits.filter(s => 
                (s.states && s.states.includes('all')) || 
                (s.states && s.states.includes(state)) || 
                s.state === state
            );
        }

        if (category) {
            allBenefits = allBenefits.filter(s => s.category === category);
        }

        if (type) {
            allBenefits = allBenefits.filter(s => s.benefit_type_group === type);
        }

        if (search) {
            const q = search.toLowerCase();
            allBenefits = allBenefits.filter(s => 
                s.name.toLowerCase().includes(q) || 
                (s.description && s.description.toLowerCase().includes(q)) ||
                (s.benefit && s.benefit.toLowerCase().includes(q))
            );
        }

        res.json({ success: true, count: allBenefits.length, data: allBenefits });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch benefits' });
    }
});

router.post('/check-eligibility', (req, res) => {
    const { state, land_acres, farmer_type } = req.body;
    
    let allBenefits = [
        ...SCHEMES.map(s => ({ ...s, benefit_type_group: 'scheme' })),
        ...SUBSIDIES.map(s => ({ ...s, benefit_type_group: 'subsidy' }))
    ];

    const eligible = allBenefits.filter(s => {
        // State Check
        const stateMatch = !state || state === 'All India' || 
            (s.states && (s.states.includes('all') || s.states.includes(state))) ||
            (s.state && s.state === state) ||
            (s.eligibility && s.eligibility.states && (s.eligibility.states.includes('all') || s.eligibility.states.includes(state)));

        // Land Check
        let landMatch = true;
        if (s.eligibility && land_acres !== undefined) {
            const min = s.eligibility.min_land_acres || 0;
            const max = s.eligibility.max_land_acres || 999999;
            landMatch = land_acres >= min && land_acres <= max;
        }

        // Farmer Type Check
        let typeMatch = true;
        if (s.eligibility && s.eligibility.farmer_type && farmer_type) {
            typeMatch = s.eligibility.farmer_type.includes('all') || s.eligibility.farmer_type.includes(farmer_type);
        }

        return stateMatch && landMatch && typeMatch;
    });

    res.json({ success: true, count: eligible.length, data: eligible });
});

module.exports = router;
