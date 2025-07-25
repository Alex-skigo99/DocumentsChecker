const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateResponse(prompt) {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
    });
    return response;
}

async function generateResponseVision(prompt, imageUrl) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: imageUrl } },
            ],
        }],
        temperature: 0.2,
    });
    return response;
}

module.exports = {
    generateResponse,
    generateResponseVision
};
