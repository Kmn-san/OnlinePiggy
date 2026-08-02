import { ENV } from "../config/env.js";

// Note: This Map will grow infinitely in production. 
// Fine for now, but consider 'express-rate-limit' later!
const userRequests = new Map();

export const aiChat = async (req, res) => {
    // 1. SECURITY: Check authorization FIRST before reading req.user.id
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const { message } = req.body;

    // 2. VALIDATION: Make sure a message was actually provided
    if (!message) {
        return res.status(400).json({ message: "Message text is required." });
    }

    // 3. RATE LIMITING
    const now = Date.now();
    const last = userRequests.get(userId) || 0;

    if (now - last < 2000) {
        return res.status(429).json({ message: "Too fast, slow down." });
    }

    userRequests.set(userId, now);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Note: Standard OpenRouter model ID for DeepSeek V3 is usually just "deepseek/deepseek-chat"
                model: "deepseek/deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "You are a specialized financial AI assistant. Your goal is to help users manage their money, budget effectively, and build wealth. Provide practical, easy-to-understand advice on saving money, cutting expenses, and personal finance. Be encouraging and concise. If a user asks about non-financial topics, politely guide the conversation back to money management. Note: Remind users for highly complex tax or legal issues that you are an AI, not a licensed professional."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenRouter Error:", data.error);
            return res.status(response.status).json({
                message: "AI service is currently unavailable. Please try again."
            });
        }

        // 5. SUCCESS: Send the reply
        res.json({
            reply: data.choices[0].message.content
        });

    } catch (err) {
        // This catch block will now only run if your server loses internet/connection
        console.error("AI Chat Error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};