import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
    config: {
      systemInstruction: `You are a helpful assistant that explains things in a concise manner.`,
    }
  });
  console.log(response.text);
}

await main();