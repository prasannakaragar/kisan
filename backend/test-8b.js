require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test8b() {
    console.log("Testing Gemini 1.5 Flash 8B...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
        const result = await model.generateContent("test");
        console.log("Success!");
    } catch (e) {
        console.log(`Error: ${e.status} - ${e.message}`);
    }
}

test8b();
