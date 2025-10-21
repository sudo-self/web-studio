// --- app/api/ai/route.ts ---

import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim() || "";

    if (!prompt) {
      return NextResponse.json({ text: "No prompt provided" });
    }

    if (!GEMINI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY environment variable is not set");
    }

    // CORRECT Gemini API endpoint - this is the actual working model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert web developer. Create responsive HTML with inline CSS for: "${prompt}"

CRITICAL: Return ONLY the HTML code with inline styles. No explanations, no markdown, no backticks.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000,
            topP: 0.8,
            topK: 40
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!rawText.trim()) {
      throw new Error("Gemini returned empty response");
    }

    // Clean the response - remove any markdown formatting
    let cleaned = rawText
      .replace(/```(html|css|js)?/gi, '')
      .replace(/```/g, '')
      .replace(/^`|`$/g, '')
      .trim();

    return NextResponse.json({ text: cleaned });

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { 
        text: "",
        error: err instanceof Error ? err.message : "Unknown error occurred" 
      },
      { status: 500 }
    );
  }
}








