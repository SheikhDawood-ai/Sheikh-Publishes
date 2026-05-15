// AI service using backend proxy for security and performance (SSE support)
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  /**
   * Deep dive dialogue analyst
   */
  startOnboardingConsultant: async (userResponse: string, history: any[] = [], onStream?: (text: string) => void) => {
    try {
      const formattedHistory = history.map(h => {
        let contentText = "";
        if (h.parts && Array.isArray(h.parts) && h.parts.length > 0) {
          contentText = typeof h.parts[0].text === 'string' ? h.parts[0].text : JSON.stringify(h.parts[0].text);
        } else if (h.content) {
          contentText = h.content;
        } else if (h.text) {
          contentText = h.text;
        }
        return {
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: contentText }]
        };
      });

      // Ensure history starts with a user message as per Gemini requirements
      const firstUserIndex = formattedHistory.findIndex(h => h.role === 'user');
      const cleanHistory = firstUserIndex !== -1 ? formattedHistory.slice(firstUserIndex) : [];

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are a Senior Strategic Business Consultant. Analyze the freelancer's input and ask ONE deep strategic question. MANDATORY: At the end of your response, provide 3-4 'Quick Reply' options in strictly this format: CHIPS: [Option 1], [Option 2], [Option 3]"
        },
        history: cleanHistory as any
      });

      const response = await chat.sendMessageStream({ message: userResponse });
      let fullText = "";

      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
          if (onStream) onStream(fullText);
        }
      }

      return { text: fullText };
    } catch (e: any) {
      console.error("AI Error:", e);
      if (e.message?.includes("API key not valid")) {
         return { text: "Protocol Error: Gemini API key is missing or invalid. Please check your project secrets." };
      }
      return { text: "Signal interference detected. Attempting to reconnect the tactical link... Should we focus on niche target or tech stack?" };
    }
  },

  /**
   * General neural chat interface
   */
  chat: async (message: string, history: any[] = []): Promise<string> => {
    try {
      const response = await aiService.startOnboardingConsultant(message, history);
      return response.text;
    } catch (e) {
      return "Neural link offline. Please re-initialize.";
    }
  },

  /**
   * Enhanced Market Research
   */
  performMarketResearch: async (niche: string, onStatus?: (status: string) => void) => {
    const statuses = [
      "Initializing Search Retrieval...",
      "Scraping Industry Reports...",
      "Extracting User Pain Points...",
      "Synthesizing Strategy..."
    ];

    try {
      if (onStatus) {
        for (const status of statuses) {
          onStatus(status);
          await new Promise(r => setTimeout(r, 600));
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Perform a deep 2026 market analysis for the "${niche}" niche. Return valid JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trends: { type: Type.ARRAY, items: { type: Type.STRING } },
              pricing: { 
                type: Type.OBJECT, 
                properties: { entry: { type: Type.STRING }, pro: { type: Type.STRING } } 
              },
              painPoints: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: { frustration: { type: Type.STRING }, techPotential: { type: Type.STRING } }
                } 
              }
            }
          }
        }
      });

      if (!response.text) throw new Error('Research link failure.');
      return JSON.parse(response.text);
    } catch (e: any) {
      console.error("Research Error:", e);
      return null;
    }
  },

  /**
   * NLP Update Engine for profile direction
   */
  parseProfileShift: async (text: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Parse this business direction shift and return a structured object: "${text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              niche: { type: Type.STRING },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              goals: { type: Type.STRING }
            }
          }
        }
      });
      if (!response.text) throw new Error('Shift analysis failure.');
      return JSON.parse(response.text);
    } catch (e) {
      return null;
    }
  },

  /**
   * Analyze an opportunity and generate a summary + scores
   */
  analyzeOpportunity: async (jobData: any) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Analyze this freelance job posting and provide:
            1. A concise summary.
            2. Scores (0-100) for: Demand, Competition, Complexity, AI-Leverage.
            3. underserved angles or hooks.
            Job: ${JSON.stringify(jobData)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  demand: { type: Type.NUMBER },
                  competition: { type: Type.NUMBER },
                  complexity: { type: Type.NUMBER },
                  aiLeverage: { type: Type.NUMBER }
                }
              },
              hooks: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      if (!response.text) throw new Error('Analysis link failure.');
      return JSON.parse(response.text);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return null;
    }
  },

  /**
   * Provide tailored financial advice
   */
  getFinancialAdvice: async (spendingData: any[], userProfile: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As a high-level financial advisor for a ${userProfile}, analyze these spending records and provide insights: ${JSON.stringify(spendingData.slice(0, 30))}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              suggestions: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                    impact: { type: Type.STRING }
                  }
                } 
              },
              savings: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      if (!response.text) throw new Error('Financial advice link failure.');
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Finance Advice Error:", error);
      return null;
    }
  },

  /**
   * Dynamically determine what specs to track
   */
  getDynamicSpecs: async (niche: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Given the freelance niche "${niche}", determine which 4 key comparison specs/metrics matter most.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              specs: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      if (!response.text) throw new Error('Spec extraction failure.');
      const data = JSON.parse(response.text);
      return data.specs || ["Pricing", "Speed", "Quality", "Rating"];
    } catch (error) {
      return ["Pricing", "Speed", "Quality", "Rating"];
    }
  },

  /**
   * Identify competitors automatically
   */
  discoverCompetitors: async (keywords: string[]) => {
    try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Identify 3 top-performing fictional or common real-world freelancer/agency competitors for: ${keywords.join(", ")}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  niche: { type: Type.STRING },
                  pricing: { type: Type.STRING },
                  specs: { type: Type.OBJECT }
                }
              }
            }
          }
        });
        if (!response.text) throw new Error('Competitor discovery failure.');
        return JSON.parse(response.text);
    } catch (error) {
      return [];
    }
  }
};
