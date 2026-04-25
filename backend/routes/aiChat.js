const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SCHEMES } = require('./schemes');
const { SUBSIDIES } = require('./subsidy');
const { FALLBACK_DATA: PRICES } = require('./cropPrices');
const { JOBS } = require('./labour');
const { LISTINGS } = require('./marketplace');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are "Kisan Sahayak", the universal AI assistant for the Kisan Platform. 
You help farmers with:
1. Mandi Prices (Rates) across India.
2. Govt Schemes & Subsidies.
3. Hiring/Finding Labour.
4. Buying/Selling in the Marketplace.
5. Crop Health & General Advice.

If the user asks about rates, check the Punjab/Maharashtra/etc. data.
If the user asks about money, check schemes.
Be helpful, concise, and local.
`;

// Local Fallback Search Logic
function localSearch(message) {
    const q = message.toLowerCase().trim();
    
    // 1. MODULE NAVIGATION HELP
    const modules = [
        { name: 'Crop Prices', keywords: ['price', 'rate', 'mandi', 'cost', 'market', 'amt', 'value', 'sell', 'bazaar'], path: '/prices' },
        { name: 'Benefits (Schemes & Subsidies)', keywords: ['scheme', 'subsidy', 'money', 'grant', 'govt', 'kisan', 'help', 'benefit', 'apply'], path: '/benefits' },
        { name: 'Labour Hire', keywords: ['labour', 'worker', 'help', 'hire', 'people', 'job', 'work', 'manpower'], path: '/labour' },
        { name: 'Marketplace', keywords: ['buy', 'sell', 'tractor', 'buffalo', 'cow', 'seed', 'tool', 'equipment', 'old', 'used'], path: '/marketplace' },
        { name: 'Crop Health AI', keywords: ['disease', 'pest', 'leaf', 'sick', 'ai', 'camera', 'photo', 'identify', 'cure'], path: '/crop-health' },
    ];

    // 2. CROP PRICE SEARCH
    if (q.includes('price') || q.includes('rate') || q.includes('mandi') || q.includes('cost') || q.includes('market')) {
        let priceResults = PRICES;
        
        // Extract State
        const states = ['punjab', 'karnataka', 'maharashtra', 'haryana', 'bihar', 'up', 'rajasthan', 'gujarat', 'tamil nadu', 'ap', 'andhra'];
        const stateMatch = states.find(s => q.includes(s));
        if (stateMatch) {
            priceResults = priceResults.filter(p => p.state.toLowerCase().includes(stateMatch.replace('up', 'uttar pradesh').replace('ap', 'andhra pradesh')));
        }

        // Extract Crop
        const matchedCrops = PRICES.map(p => p.commodity.toLowerCase());
        const cropMatch = matchedCrops.find(c => q.includes(c));
        if (cropMatch) {
            priceResults = priceResults.filter(p => p.commodity.toLowerCase() === cropMatch);
        }

        if (priceResults.length > 0) {
            let res = `📊 **Current Mandi Rates (Verified):**\n\n`;
            priceResults.slice(0, 5).forEach(p => {
                res += `📍 **${p.market} (${p.state})**\n`;
                res += `🌾 ${p.commodity}: **₹${p.modal_price}/quintal**\n`;
                res += `📈 Range: ₹${p.min_price} - ₹${p.max_price}\n\n`;
            });
            res += `You can see all live rates here: [Open Crop Prices](/prices)`;
            return res;
        }
    }

    // 3. LABOUR SEARCH
    if (q.includes('labour') || q.includes('worker') || q.includes('hire') || q.includes('job') || q.includes('work')) {
        const labourResults = JOBS.filter(j => 
            q.includes(j.state.toLowerCase()) || 
            q.includes(j.crop.toLowerCase()) || 
            q.includes(j.work_type.toLowerCase()) ||
            q.includes(j.village.toLowerCase())
        );
        if (labourResults.length > 0) {
            let res = `👥 **Labour Opportunities Found:**\n\n`;
            labourResults.slice(0, 3).forEach(j => {
                res += `🏗️ **${j.title}**\n`;
                res += `📍 ${j.village}, ${j.state}\n`;
                res += `💰 Wage: **₹${j.wage_per_day}/day**\n`;
                res += `📞 Contact: ${j.farmer_phone} (${j.farmer_name})\n\n`;
            });
            res += `Apply for more jobs here: [Open Labour Hire](/labour)`;
            return res;
        }
    }

    // 4. MARKETPLACE SEARCH
    if (q.includes('buy') || q.includes('sell') || q.includes('tractor') || q.includes('buffalo') || q.includes('cow') || q.includes('seeds') || q.includes('equipment')) {
        const marketResults = LISTINGS.filter(l => 
            q.includes(l.title.toLowerCase()) || 
            q.includes(l.category.toLowerCase()) || 
            q.includes(l.state.toLowerCase()) ||
            q.includes(l.sub_category.toLowerCase())
        );
        if (marketResults.length > 0) {
            let res = `🛒 **Marketplace Items for You:**\n\n`;
            marketResults.slice(0, 3).forEach(l => {
                res += `📦 **${l.title}**\n`;
                res += `💰 Price: **₹${l.price.toLocaleString()}**\n`;
                res += `📍 ${l.village}, ${l.state}\n`;
                res += `👤 Seller: ${l.seller_name}\n\n`;
            });
            res += `See all listings: [Open Marketplace](/marketplace)`;
            return res;
        }
    }

    // 5. BENEFITS SEARCH (SCHEMES/SUBSIDIES)
    const allBenefits = [...SCHEMES.map(s => ({ ...s, group: 'scheme' })), ...SUBSIDIES.map(s => ({ ...s, group: 'subsidy' }))];
    const benefitResults = allBenefits.filter(item => {
        const text = (item.name + " " + (item.description || item.benefit || "") + " " + (item.state || "") + " " + item.category).toLowerCase();
        return text.includes(q) || q.split(' ').some(word => word.length > 4 && text.includes(word));
    });

    if (benefitResults.length > 0) {
        let res = `🏛️ **Top Govt Benefits Found:**\n\n`;
        benefitResults.slice(0, 3).forEach(item => {
            res += `✅ **${item.name}**\n`;
            res += `💡 ${item.benefit || item.description}\n`;
            if (item.apply_link) res += `🔗 [Apply Now](${item.apply_link})\n`;
            res += `\n`;
        });
        res += `Browse all benefits here: [Benefits Portal](/benefits)`;
        return res;
    }

    // 6. MODULE NAVIGATION FALLBACK (The "Everything" Search)
    const matchedModules = modules.filter(m => m.keywords.some(k => q.includes(k)));
    if (matchedModules.length > 0) {
        let res = `I can help you with that! Please visit the specialized module:\n\n`;
        matchedModules.forEach(m => {
            res += `🚀 **${m.name}**\n   [Click here to open](${m.path})\n\n`;
        });
        return res;
    }

    // 7. GENERAL PLATFORM HELP
    if (q.includes('help') || q.includes('how') || q.includes('what') || q.includes('platform') || q.includes('app')) {
        let res = `Welcome to the **Kisan Platform**! 🌾\n\nI am your digital assistant, here to help you navigate EVERYTHING we offer:\n\n`;
        res += `📊 **Prices**: Check latest Mandi rates.\n`;
        res += `🏛️ **Benefits**: Apply for Schemes & Subsidies.\n`;
        res += `👥 **Labour**: Hire workers or find farm jobs.\n`;
        res += `🛒 **Market**: Buy/Sell tractors, seeds & livestock.\n`;
        res += `🏥 **Crop AI**: Identify diseases with your camera.\n`;
        res += `💰 **Finance**: Apply for Agri Loans & Insurance.\n`;
        res += `📈 **Business**: Explore new farm business ideas.\n\n`;
        res += `Just ask me a question like *"Wheat price in Punjab"* or *"Need tractor subsidy"* to get started!`;
        return res;
    }

    return "I am **Kisan Sahayak**! 🌾\n\nI can help you with **EVERYTHING** on this platform:\n• **Mandi Rates** (Ask: 'Wheat price in Punjab')\n• **Govt Schemes** (Ask: 'Tractor subsidy')\n• **Labour Jobs** (Ask: 'Need harvesting workers')\n• **Marketplace** (Ask: 'Want to buy a buffalo')\n\nWhat are you looking for today?";
}

router.post('/chat', async (req, res) => {
    const { message, history } = req.body;
    
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('YOUR_')) {
            throw new Error('API_KEY_MISSING');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Understood." }] },
                ...(history || [])
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        res.json({ success: true, reply: response.text() });

    } catch (err) {
        console.warn('Gemini API failed or quota exceeded. Falling back to local search.');
        const fallbackReply = localSearch(message);
        res.json({ 
            success: true, 
            reply: fallbackReply,
            is_fallback: true,
            error_info: err.status === 429 ? 'Quota Exceeded' : 'Service Unavailable'
        });
    }
});

module.exports = router;
