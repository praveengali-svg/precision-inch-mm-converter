
import { GoogleGenAI, Type } from "@google/genai";
import { SmartParseResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseMeasurement = async (input: string): Promise<SmartParseResult | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Parse this measurement: "${input}". 
      Convert it to decimal inches. 
      If it's in feet and inches (e.g. 5' 2"), convert the whole thing to inches. 
      If it's a fraction (e.g. 3/4), convert to decimal. 
      Return JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            value: {
              type: Type.NUMBER,
              description: 'The numeric value in inches.',
            },
            unit: {
              type: Type.STRING,
              description: 'The original unit detected.',
            },
            explanation: {
              type: Type.STRING,
              description: 'Brief explanation of the conversion.',
            },
          },
          required: ["value", "unit", "explanation"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as SmartParseResult;
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return null;
  }
};
