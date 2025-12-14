import * as functions from "firebase-functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Securely access the API Key. 
// In production, use: functions.config().gemini.key or Secret Manager
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeVideo = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { videoData, mimeType } = data; // Expect base64 data

    if (!videoData) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "videoData" argument.');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    You are a Viral Content Analyst expert. Deconstruct the following short-form video (Reel/TikTok/Short) to allow us to understand why it went viral (or why it failed).
    
    Analyze the video structure and content. Return the result as a strictly valid JSON object with the following schema:
    {
      "hook": "Description of the first 3-5 seconds. What grabbed attention? Visuals? Audio? Text?",
      "retention": "What kept the viewer watching in the middle? Conflict? Curiosity gap? Humor?",
      "payoff": "How did it end? CTA? Joke punchline? Satisfaction?",
      "sentiment": "Overall emotional summary (1-2 sentences)",
      "tones": [
        {"label": "Excitement", "score": 0.9},
        {"label": "Curiosity", "score": 0.7}
      ] (Array of top 3-5 dominant tones with intensity 0.0-1.0),
      "score": number (1-10 viral potential score),
      "improvement_tips": ["Tip 1", "Tip 2", "Tip 3"]
    }
    
    Do not include markdown code blocks. Just the raw JSON string.
  `;

    try {
        const videoPart = {
            inlineData: {
                data: videoData,
                mimeType: mimeType || 'video/mp4'
            }
        };

        const result = await model.generateContent([prompt, videoPart]);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        throw new functions.https.HttpsError('internal', 'Analysis failed');
    }
});

export const remixScript = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { analysis, variables } = data;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    You are a viral scriptwriter. relying on the following deconstruction of a viral video:
    
    ORIGINAL STRUCTURE:
    - HOOK: ${analysis.hook}
    - RETENTION: ${analysis.retention}
    - PAYOFF: ${analysis.payoff}
    - TONE SUMMARY: ${analysis.sentiment}
    - TOP TONES: ${analysis.tones ? analysis.tones.map((t: any) => t.label).join(', ') : 'N/A'}
    
    TASK: Write a NEW script for a DIFFERENT niche, but keeping the EXACT SAME structural beats and pacing.
    
    NEW VARIABLES:
    - NICHE: ${variables.niche}
    - PRODUCT/TOPIC: ${variables.product}
    - AUDIENCE: ${variables.audience}
    - DESIRED TONE: ${variables.tone}
    
    OUTPUT FORMAT:
    Return ONLY the script in a clear, readable format with [Scene directions] in brackets.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return { script: response.text() };
    } catch (error) {
        console.error("Gemini Remix Failed:", error);
        throw new functions.https.HttpsError('internal', 'Remix failed');
    }
});
