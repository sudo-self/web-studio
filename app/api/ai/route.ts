// --- app/api/ai/route.ts ---

import { NextRequest, NextResponse } from "next/server";
import { ApiRequestBody, ApiResponse, ChatMessage } from "@/types";

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body: ApiRequestBody = await req.json();
    const prompt = body?.prompt?.trim() || "";
    const mode = body?.mode || "response";
    const chatHistory: ChatMessage[] = body?.chatHistory || [];

    console.log("Received AI request:", { prompt, mode, chatHistoryLength: chatHistory.length });

    if (!prompt) {
      const response: ApiResponse = { text: "Please provide a prompt" };
      return NextResponse.json(response, { status: 400 });
    }

  
    if (!GEMINI_API_KEY) {
      console.warn("No Gemini API key - using fallback");
      const fallback = generateFallbackComponent(prompt);
      const response: ApiResponse = { text: fallback };
      return NextResponse.json(response);
    }

   
    let fullPrompt = `As a senior front-end developer, create clean, responsive HTML with inline CSS.

REQUIREMENTS:
- Return ONLY the HTML code with inline styles
- No markdown, no backticks, no explanations
- Make it mobile-friendly and accessible
- Use semantic HTML5 elements
- Include proper ARIA labels where needed
- Ensure responsive design

Create this component: ${prompt}`;


    if (mode === "chat" && chatHistory.length > 0) {
      const recentHistory = chatHistory.slice(-4); 
      const historyContext = recentHistory.map((msg: ChatMessage) => 
        `${msg.role}: ${msg.content}`
      ).join('\n');
      fullPrompt = `Chat history:\n${historyContext}\n\nCurrent request: ${prompt}\n\nResponse:`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      const fallback = generateFallbackComponent(prompt);
      const apiResponse: ApiResponse = { text: fallback };
      return NextResponse.json(apiResponse);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log("Gemini raw response:", rawText.substring(0, 200) + "...");

    if (!rawText.trim()) {
      throw new Error("Empty response from Gemini");
    }

    const cleaned = cleanAIResponse(rawText);
    const apiResponse: ApiResponse = { text: cleaned };
    
    return NextResponse.json(apiResponse);

  } catch (err) {
    console.error("API route error:", err);
    const fallback = generateFallbackComponent("Error fallback component");
    const response: ApiResponse = { 
      text: fallback,
      error: err instanceof Error ? err.message : "Unknown error"
    };
    return NextResponse.json(response);
  }
}

function cleanAIResponse(text: string): string {
  if (!text) return "";
  
  let cleaned = text
    .replace(/^```(?:html|css|js)?\s*/gi, '')
    .replace(/\s*```$/gi, '')
    .replace(/```/g, '')
    .replace(/^`|`$/g, '')
    .trim();


  if (cleaned.includes('<') && cleaned.includes('>')) {
    const firstTagIndex = cleaned.indexOf('<');
    if (firstTagIndex > 0) {
      cleaned = cleaned.substring(firstTagIndex);
    }
  }

  return cleaned || generateFallbackComponent("Cleaned component");
}

function generateFallbackComponent(prompt: string): string {
  return `<!-- AI Generated: ${prompt} -->
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 2rem; text-align: center; border-radius: 12px; margin: 1rem 0;">
  <h2 style="margin-bottom: 1rem; font-size: 2rem;">${prompt}</h2>
  <p style="margin-bottom: 2rem; opacity: 0.9;">Beautiful, responsive component</p>
  <button style="background: white; color: #667eea; border: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
    Get Started
  </button>
</div>`;
}




