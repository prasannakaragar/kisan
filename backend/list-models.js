require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    console.log("Listing available models...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // The SDK doesn't have a direct listModels, we usually use the REST API for that
        // But let's try a few standard names
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];
        
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                console.log(`✅ ${m} is working!`);
            } catch (e) {
                console.log(`❌ ${m} failed: ${e.status || e.message}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

listModels();
