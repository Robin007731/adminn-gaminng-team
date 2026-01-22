
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async analyzeChatSafety(messages: string[]) {
    try {
      // Fix: For reasoning tasks with structured output, gemini-3-pro-preview is recommended
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analiza los siguientes mensajes de chat y reporta cualquier toxicidad, spam o violación de reglas.
        Mensajes: ${messages.join(' | ')}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isToxic: { type: Type.BOOLEAN },
              riskLevel: { type: Type.STRING, description: 'Low, Medium, High' },
              reason: { type: Type.STRING },
              suggestedAction: { type: Type.STRING }
            },
            required: ["isToxic", "riskLevel", "reason"]
          }
        }
      });
      // Fix: Directly access the .text property
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini analysis failed:", error);
      return null;
    }
  },

  async generateTournamentDescription(name: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Genera una descripción épica y llamativa para un torneo de gaming llamado "${name}". Incluye un tono competitivo y emocionante para atraer a los mejores jugadores.`,
      });
      // Fix: Directly access the .text property
      return response.text;
    } catch (error) {
      console.error("Description generation failed:", error);
      return "Torneo oficial de Zona Gamer.";
    }
  }
};
