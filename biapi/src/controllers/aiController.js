import { GoogleGenAI } from "@google/genai";

export const generateResponse = async (req, res) => {
    try {
        const { prompt } = req.body;
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const result = await ai.interactions.create({
            model: "gemini-3.8-flash",
            input: prompt,
        });

        console.log(result.output_text);
        res.json({ response: "Generated response for: " + result.output_text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



