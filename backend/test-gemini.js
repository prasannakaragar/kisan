require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log("Testing Gemini API Key...");
    console.log("Key:", process.env.GEMINI_API_KEY ? "FOUND" : "NOT FOUND");
    
    if (!process.env.GEMINI_API_KEY) return;

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (err) {
        console.error("API Test Failed!");
        console.error("Error Code:", err.status || "Unknown");
        console.error("Error Message:", err.message);
        if (err.errorDetails) {
            console.error("Details:", JSON.stringify(err.errorDetails, null, 2));
        }
    }
}

testGemini();
