import { GoogleGenAI, Type } from "@google/genai";
import { VideoIdea } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateVideoIdeas(niche: string): Promise<VideoIdea[]> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analyze the current trending topics, news, and popular content formats for the YouTube niche: "${niche}".
    Based on this analysis of current data, generate 10 unique, high-potential video ideas.
    
    For each idea, provide:
    1. A catchy, high-CTR title.
    2. A detailed thumbnail concept (visual elements, text overlays, color scheme).
    3. A clear video concept/description explaining why this will perform well.
    4. Estimated views (e.g., "50k - 200k") based on similar trending content.
    5. The specific trending reason or data point that inspired this idea.
    
    Return the result as a JSON array of objects.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            thumbnailConcept: { type: Type.STRING },
            concept: { type: Type.STRING },
            estimatedViews: { type: Type.STRING },
            trendingReason: { type: Type.STRING },
          },
          required: ["title", "thumbnailConcept", "concept", "estimatedViews", "trendingReason"],
        },
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate ideas. Please try again.");
  }
}
