// src/services/api.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true
});

const RATE_LIMIT = 3; // 3 requests per minute
let lastRequests = [];

export async function getAIResponse(userMessage) {
  const now = Date.now();
  lastRequests = lastRequests.filter(t => now - t < 60000);
  
  if (lastRequests.length >= RATE_LIMIT) {
    throw new Error("rate_limit_exceeded");
  }
  
  lastRequests.push(now);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You're CampusCopilot, an AI assistant for college students..." },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}