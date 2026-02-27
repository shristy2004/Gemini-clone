import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const runChat = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;

        const text = response.text();
        console.log("API Response:", text);

        return response.text();

    }
    catch (error) {
        console.error("Error generating content:", error);
        return "Sorry, I couldn't generate a response.";
    }
};

