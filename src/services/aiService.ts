import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getCarAdvice(symptoms: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert car mechanic advisor. A user is describing symptoms of their car: "${symptoms}". 
      Provide a brief, professional analysis of what might be wrong and suggest which service they should book (Oil Change, Mechanical Repair, Electrical & Diagnostics, or Computer Scan). 
      Format the response in a clear, supportive way. Keep it under 150 words.`,
      config: {
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "I'm sorry, I'm having trouble analyzing your request right now. Please describe the symptoms again or contact our technicians directly.";
  }
}

export async function predictServiceType(description: string): Promise<'oil_change' | 'mechanical' | 'electrical' | 'diagnostic' | 'general'> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following car issue and return ONLY the most appropriate category identifier from this list: oil_change, mechanical, electrical, diagnostic, general.
      Issue: "${description}"`,
      config: {
        temperature: 0.1,
      },
    });

    const result = response.text?.trim().toLowerCase();
    if (result?.includes('oil_change')) return 'oil_change';
    if (result?.includes('mechanical')) return 'mechanical';
    if (result?.includes('electrical')) return 'electrical';
    if (result?.includes('diagnostic')) return 'diagnostic';
    return 'general';
  } catch (error) {
    return 'general';
  }
}
