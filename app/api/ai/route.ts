import { NextRequest, NextResponse } from "next/server";
import { ApiRequestBody, ApiResponse, ChatMessage } from "@/types";

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash"; 

export async function POST(req: NextRequest) {
  try {
    const body: ApiRequestBody = await req.json();
    const prompt = body?.prompt?.trim() || "";
    const mode = body?.mode || "response";
    const chatHistory: ChatMessage[] = body?.chatHistory || [];

    console.log("=== AI Request ===");
    console.log("Prompt:", prompt);
    console.log("Mode:", mode);

    // Validation
    if (!prompt) {
      return NextResponse.json(
        { text: "Please provide a prompt" } as ApiResponse,
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      console.error("Missing API key");
      return NextResponse.json({
        text: createErrorHTML("API Key Missing", "Please set GOOGLE_AI_API_KEY in .env.local"),
      } as ApiResponse);
    }

    // Build enhanced prompt
    const fullPrompt = buildPrompt(prompt, mode, chatHistory);
    console.log("Full prompt length:", fullPrompt.length);

    // Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096, // Increased for better responses
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Gemini API error:", apiResponse.status, errorText);
      
      return NextResponse.json({
        text: createErrorHTML(
          `API Error (${apiResponse.status})`,
          getErrorMessage(apiResponse.status, errorText)
        ),
      } as ApiResponse);
    }

    const data = await apiResponse.json();
    
    // Extract response with better error handling
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      console.error("Empty or invalid response structure:", JSON.stringify(data, null, 2));
      return NextResponse.json({
        text: createErrorHTML(
          "Empty Response",
          "AI returned no content. This might be due to safety filters or API issues."
        ),
      } as ApiResponse);
    }

    console.log("Raw response length:", rawText.length);
    
    // Clean and validate response
    const cleaned = cleanAIResponse(rawText);
    
    if (!cleaned.trim()) {
      return NextResponse.json({
        text: createErrorHTML("Invalid Response", "AI returned empty content after processing"),
      } as ApiResponse);
    }

    console.log("✓ Successfully generated response");
    return NextResponse.json({ text: cleaned } as ApiResponse);

  } catch (err) {
    console.error("API route error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    
    return NextResponse.json({
      text: createErrorHTML("Server Error", errorMessage),
      error: errorMessage,
    } as ApiResponse);
  }
}

// Enhanced prompt builder
function buildPrompt(prompt: string, mode: string, chatHistory: ChatMessage[]): string {
  const systemPrompt = `You are an expert web developer specializing in creating clean, modern, responsive HTML components with inline CSS.

CRITICAL REQUIREMENTS:
1. Return ONLY HTML code - no explanations, no markdown, no code blocks
2. Use semantic HTML5 elements (header, nav, section, article, footer, etc.)
3. Include comprehensive inline CSS for complete styling
4. Make everything fully responsive with mobile-first approach
5. Use modern CSS (flexbox, grid, CSS variables)
6. Ensure accessibility (ARIA labels, alt text, semantic structure)
7. Include proper meta tags if it's a full page
8. Use professional color schemes and spacing
9. Add smooth transitions and hover effects
10. Ensure cross-browser compatibility

STYLING GUIDELINES:
- Use CSS variables for consistency: --primary-color, --text-color, etc.
- Include @media queries for responsive design
- Add proper padding/margin for visual hierarchy
- Use box-shadow for depth
- Include smooth transitions (transition: all 0.3s ease)
- Use modern fonts (system fonts or web-safe fallbacks)

ALWAYS START WITH: <!DOCTYPE html> if creating a full page
Otherwise, return just the component HTML`;

  if (mode === "chat" && chatHistory.length > 0) {
    const history = chatHistory
      .slice(-4)
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    return `${systemPrompt}

CONVERSATION HISTORY:
${history}

NEW REQUEST: ${prompt}

Generate the HTML component now:`;
  }

  return `${systemPrompt}

USER REQUEST: ${prompt}

Generate the HTML component now:`;
}

// Improved response cleaning
function cleanAIResponse(text: string): string {
  if (!text) return "";
  
  let cleaned = text.trim();
  
  // Remove markdown code blocks
  cleaned = cleaned.replace(/^```(?:html|css|js|javascript)?\s*\n?/gi, '');
  cleaned = cleaned.replace(/\n?\s*```$/g, '');
  cleaned = cleaned.replace(/```/g, '');
  
  // Remove inline code markers
  cleaned = cleaned.replace(/^`+|`+$/g, '');
  
  // If response starts with explanation text before HTML, try to extract HTML
  const htmlMatch = cleaned.match(/<!DOCTYPE html>|<html|<div|<section|<header|<nav|<main|<article|<footer/i);
  if (htmlMatch && htmlMatch.index && htmlMatch.index > 50) {
    // There's likely explanation text before the HTML
    cleaned = cleaned.substring(htmlMatch.index);
  }
  
  // Check if we have valid HTML
  if (!containsHTML(cleaned)) {
    // If no HTML tags, wrap in a styled div
    return `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <h2 style="margin-bottom: 1rem;">AI Response</h2>
  <p style="line-height: 1.6; white-space: pre-wrap;">${escapeHtml(cleaned)}</p>
</div>`;
  }
  
  // Remove trailing explanations after HTML
  const lastHtmlTag = Math.max(
    cleaned.lastIndexOf('</html>'),
    cleaned.lastIndexOf('</div>'),
    cleaned.lastIndexOf('</section>'),
    cleaned.lastIndexOf('</footer>')
  );
  
  if (lastHtmlTag > 0 && lastHtmlTag < cleaned.length - 1) {
    const afterHtml = cleaned.substring(lastHtmlTag + 10).trim();
    if (afterHtml.length > 0 && !containsHTML(afterHtml)) {
      // Remove explanation text after HTML
      cleaned = cleaned.substring(0, lastHtmlTag + 10);
    }
  }
  
  return cleaned.trim();
}

// Helper functions
function containsHTML(text: string): boolean {
  return /<[^>]+>/g.test(text);
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function createErrorHTML(title: string, message: string): string {
  return `<div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 2rem; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 2rem auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
    <span style="font-size: 1.8rem;">⚠️</span>
    ${escapeHtml(title)}
  </h3>
  <p style="margin: 0; line-height: 1.6; opacity: 0.95;">${escapeHtml(message)}</p>
</div>`;
}

function getErrorMessage(status: number, errorText: string): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check your prompt and try again.";
    case 401:
      return "Invalid API key. Please check your GOOGLE_AI_API_KEY in .env.local";
    case 403:
      return "API key not authorized for this service. Verify your Gemini API key permissions.";
    case 429:
      return "Rate limit exceeded. Please wait a moment and try again.";
    case 500:
    case 502:
    case 503:
      return "Gemini API is temporarily unavailable. Please try again in a few moments.";
    default:
      return `API error: ${errorText.substring(0, 200)}`;
  }
}








