import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Use the API key provided by the environment
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  // SSE Stream Endpoint - Recovery Step for Chatbot Loops
  app.post("/api/ai/stream", async (req, res) => {
    if (!genAI) {
      return res.status(503).json({ error: "Gemini API key missing in environment." });
    }

    const { prompt, history, systemInstruction } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction || "You are LancerIntel AI, a ruthless strategic advisor for high-output freelancers."
      });
      
      const chat = model.startChat({
        history: (history || []).map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        }))
      });

      const result = await chat.sendMessageStream(prompt);
      
      for await (const chunk of result.stream) {
        const text = chunk.text();
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
      
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error("Streaming Error:", error);
      res.write(`data: ${JSON.stringify({ error: error.message || "Interference detected. Retrying gateway..." })}\n\n`);
      res.end();
    }
  });

  // Structured Generation Proxy
  app.post("/api/ai/generate", async (req, res) => {
    if (!genAI) return res.status(503).json({ error: "AI Unavailable" });
    const { prompt, schema } = req.body;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const config: any = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      };
      
      if (schema) {
        config.generationConfig = {
          responseMimeType: "application/json",
          responseSchema: schema
        };
      }

      const response = await model.generateContent(config);
      res.json(JSON.parse(response.response.text()));
    } catch (error) {
      res.status(500).json({ error: "Generation failed" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LancerIntel Backend running on port ${PORT}`);
  });
}

startServer();
