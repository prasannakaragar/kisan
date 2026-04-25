require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test20() {
    console.log("Testing Gemini 2.0 Flash...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("test");
        console.log("Success!");
    } catch (e) {
        console.log(`Error: ${e.status} - ${e.message}`);
    }
}

test20();
