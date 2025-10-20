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

    console.log("=== AI API DEBUG ===");
    console.log("Prompt:", prompt);
    console.log("Mode:", mode);
    console.log("API Key exists:", !!GEMINI_API_KEY);
    console.log("API Key length:", GEMINI_API_KEY?.length);
    console.log("API Key preview:", GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : "No key");

    if (!prompt) {
      const response: ApiResponse = { text: "Please provide a prompt" };
      return NextResponse.json(response, { status: 400 });
    }

    // If no API key, use fallback with clear message
    if (!GEMINI_API_KEY) {
      console.error("❌ NO GEMINI API KEY FOUND");
      const fallback = `<!-- ⚠️ API KEY MISSING - Using Fallback -->
<div style="background: #ff6b6b; color: white; padding: 2rem; border-radius: 8px; margin: 1rem 0;">
  <h3 style="margin-bottom: 1rem;">⚠️ Gemini API Key Missing</h3>
  <p>Please set GOOGLE_AI_API_KEY in your environment variables.</p>
  <p>Current prompt: "${prompt}"</p>
</div>`;
      const response: ApiResponse = { text: fallback };
      return NextResponse.json(response);
    }

    // Build the prompt for Gemini
    let fullPrompt = `You are an expert web developer. Create a complete, responsive HTML component with inline CSS.

CRITICAL RULES:
- Return ONLY pure HTML with inline styles, nothing else
- No markdown, no code blocks, no explanations
- Make it fully responsive and mobile-friendly
- Use modern CSS (flexbox/grid)
- Include proper semantic HTML and accessibility
- Ensure it works as a standalone component

Create this: ${prompt}

HTML OUTPUT:`;

    // Add chat context if in chat mode
    if (mode === "chat" && chatHistory.length > 0) {
      const recentHistory = chatHistory.slice(-4);
      const historyContext = recentHistory.map((msg: ChatMessage) => 
        `${msg.role}: ${msg.content}`
      ).join('\n');
      fullPrompt = `Previous conversation:\n${historyContext}\n\nNew request: ${prompt}\n\nHTML Response:`;
    }

    console.log("Sending request to Gemini API...");

    const apiResponse = await fetch(
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
            topP: 0.8,
            topK: 40
          }
        }),
      }
    );

    console.log("Gemini API response status:", apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("❌ Gemini API error:", apiResponse.status, errorText);
      
      let errorMessage = `API Error: ${apiResponse.status}`;
      if (apiResponse.status === 401) errorMessage = "Invalid API Key";
      if (apiResponse.status === 403) errorMessage = "API Key not authorized";
      if (apiResponse.status === 429) errorMessage = "Rate limit exceeded";
      
      const fallback = `<!-- ❌ API Error: ${apiResponse.status} -->
<div style="background: #ffa94d; color: white; padding: 2rem; border-radius: 8px; margin: 1rem 0;">
  <h3 style="margin-bottom: 1rem;">⚠️ API Error (${apiResponse.status})</h3>
  <p>${errorMessage}</p>
  <p>Prompt: "${prompt}"</p>
</div>`;
      const response: ApiResponse = { text: fallback };
      return NextResponse.json(response);
    }

    const data = await apiResponse.json();
    console.log("Gemini API response data:", JSON.stringify(data, null, 2));

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log("Raw Gemini text length:", rawText.length);
    console.log("Raw text preview:", rawText.substring(0, 200) + "...");

    if (!rawText.trim()) {
      console.error("❌ Empty response from Gemini API");
      throw new Error("Empty response from Gemini API");
    }

    const cleaned = cleanAIResponse(rawText);
    console.log("Cleaned response length:", cleaned.length);
    
    const finalResponse: ApiResponse = { text: cleaned };
    console.log("✅ Successfully generated AI response");
    
    return NextResponse.json(finalResponse);

  } catch (err) {
    console.error("❌ API route error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    
    const fallback = `<!-- ❌ Server Error -->
<div style="background: #ff8787; color: white; padding: 2rem; border-radius: 8px; margin: 1rem 0;">
  <h3 style="margin-bottom: 1rem;">⚠️ Server Error</h3>
  <p>${errorMessage}</p>
  <p>Please check your API configuration.</p>
</div>`;
    
    const response: ApiResponse = { 
      text: fallback,
      error: errorMessage
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
    .replace(/^<!DOCTYPE html>[\s\S]*?<body[^>]*>/i, '')
    .replace(/<\/body>\s*<\/html>\s*$/i, '')
    .trim();

  // If no HTML tags found, it might be an error message
  if (!cleaned.includes('<') && !cleaned.includes('>')) {
    return `<div style="background: #ffe8cc; padding: 1rem; border-radius: 8px; border: 1px solid #ffa94d;">
  <p><strong>AI Response (non-HTML):</strong></p>
  <pre style="white-space: pre-wrap;">${cleaned}</pre>
</div>`;
  }

  // Extract HTML content
  if (cleaned.includes('<') && cleaned.includes('>')) {
    const firstTagIndex = cleaned.indexOf('<');
    if (firstTagIndex > 0) {
      cleaned = cleaned.substring(firstTagIndex);
    }
  }

  return cleaned;
}




