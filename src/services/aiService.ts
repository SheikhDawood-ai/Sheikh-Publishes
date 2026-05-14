// AI service using backend proxy for security and performance (SSE support)
import { SchemaType } from "@google/generative-ai";

export const aiService = {
  /**
   * Deep dive dialogue analyst with SSE (Server-Sent Events) backend support
   */
  startOnboardingConsultant: async (userResponse: string, history: any[] = [], onStream?: (text: string) => void) => {
    try {
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userResponse,
          history: history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            content: typeof h.parts[0].text === 'string' ? h.parts[0].text : JSON.stringify(h.parts[0].text)
          })),
          systemInstruction: "You are a Senior Strategic Business Consultant. Analyze the freelancer's input and ask ONE deep strategic question. MANDATORY: At the end of your response, provide 3-4 'Quick Reply' options in strictly this format: CHIPS: [Option 1], [Option 2], [Option 3]"
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') break;
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  fullText += data.text;
                  if (onStream) onStream(fullText);
                }
              } catch (e) {
                // Partial JSON or heartbeat
              }
            }
          }
        }
      }
      return { text: fullText };
    } catch (e) {
      console.error("Streaming Error:", e);
      return { text: "Signal interference detected. Attempting to reconnect the tactical link... Should we focus on niche target or tech stack?" };
    }
  },

  /**
   * Enhanced Market Research via Backend Proxy
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

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Perform a deep 2026 market analysis for the "${niche}" niche. Return valid JSON.`,
          schema: {
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
        })
      });

      return await response.json();
    } catch (e) {
      console.error("Research Error:", e);
      return null;
    }
  },

  /**
   * NLP Update Engine for profile direction
   */
  parseProfileShift: async (text: string) => {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Parse this business direction shift and return a structured object: "${text}"`,
          schema: {
            type: SchemaType.OBJECT,
            properties: {
              niche: { type: SchemaType.STRING },
              techStack: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              goals: { type: SchemaType.STRING }
            }
          }
        })
      });
      return await response.json();
    } catch (e) {
      return null;
    }
  },

  /**
   * Analyze an opportunity and generate a summary + scores
   */
  analyzeOpportunity: async (jobData: any) => {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze this freelance job posting and provide:
            1. A concise summary.
            2. Scores (0-100) for: Demand, Competition, Complexity, AI-Leverage.
            3. underserved angles or hooks.
            Job: ${JSON.stringify(jobData)}`,
          schema: {
            type: SchemaType.OBJECT,
            properties: {
              summary: { type: SchemaType.STRING },
              scores: {
                type: SchemaType.OBJECT,
                properties: {
                  demand: { type: SchemaType.NUMBER },
                  competition: { type: SchemaType.NUMBER },
                  complexity: { type: SchemaType.NUMBER },
                  aiLeverage: { type: SchemaType.NUMBER }
                }
              },
              hooks: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
            }
          }
        })
      });
      return await response.json();
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
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `As a high-level financial advisor for a ${userProfile}, analyze these spending records and provide insights: ${JSON.stringify(spendingData.slice(0, 30))}`,
          schema: {
            type: SchemaType.OBJECT,
            properties: {
              summary: { type: SchemaType.STRING },
              suggestions: { 
                type: SchemaType.ARRAY, 
                items: { 
                  type: SchemaType.OBJECT,
                  properties: {
                    title: { type: SchemaType.STRING },
                    action: { type: SchemaType.STRING },
                    impact: { type: SchemaType.STRING }
                  }
                } 
              },
              savings: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
            }
          }
        })
      });
      return await response.json();
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
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Given the freelance niche "${niche}", determine which 4 key comparison specs/metrics matter most.`,
          schema: {
            type: SchemaType.OBJECT,
            properties: {
              specs: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
            }
          }
        })
      });
      const data = await response.json();
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
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Identify 3 top-performing fictional or common real-world freelancer/agency competitors for: ${keywords.join(", ")}`,
            schema: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  niche: { type: SchemaType.STRING },
                  pricing: { type: SchemaType.STRING },
                  specs: { type: SchemaType.OBJECT }
                }
              }
            }
          })
        });
        return await response.json();
    } catch (error) {
      return [];
    }
  }
};
