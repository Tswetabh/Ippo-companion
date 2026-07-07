import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Generate a text response from Gemini.
 *
 * @param prompt       - The user/agent prompt to send
 * @param systemInstruction - Optional system instruction to shape Gemini's behaviour
 * @returns The generated text response
 */
export async function generateResponse(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: systemInstruction ? { systemInstruction } : undefined,
  });

  return response.text ?? "";
}

/**
 * Generate a structured JSON response from Gemini conforming to a schema.
 *
 * @param prompt            - The prompt to send
 * @param schema            - The response schema (JSON schema structure)
 * @param systemInstruction - Optional system instruction
 * @returns Parsed JSON object of type T
 */
export async function generateStructuredResponse<T>(
  prompt: string,
  schema: Record<string, unknown>,
  systemInstruction?: string
): Promise<T> {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const text = response.text ?? "{}";
  return JSON.parse(text) as T;
}

export { ai };
