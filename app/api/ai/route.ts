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

    // If no API key, use local generation
    if (!GEMINI_API_KEY) {
      const fallback = generateLocalComponent(prompt);
      return NextResponse.json({ text: fallback });
    }

    // CORRECT Gemini API endpoint - use gemini-1.5-flash (the actual working model)
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
                  text: `Create HTML with inline CSS for: ${prompt}. Return ONLY HTML code, no explanations, no markdown.`
                }
              ]
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
      // If API fails, use local generation
      const fallback = generateLocalComponent(prompt);
      return NextResponse.json({ text: fallback });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean the response
    let cleaned = rawText
      .replace(/```(html|css|js)?/gi, '')
      .replace(/```/g, '')
      .trim();

    // If no valid HTML, use local generation
    if (!cleaned || !cleaned.includes('<')) {
      cleaned = generateLocalComponent(prompt);
    }

    return NextResponse.json({ text: cleaned });

  } catch (err) {
    // Always return a working component
    const fallback = generateLocalComponent("your request");
    return NextResponse.json({ text: fallback });
  }
}

function generateLocalComponent(prompt: string): string {
  // Generate real components based on the prompt
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('hero')) {
    return `<!-- Hero Section: ${prompt} -->
<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 5rem 2rem; text-align: center;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h1 style="font-size: 3.5rem; margin-bottom: 1.5rem; font-weight: bold;">Amazing Hero Title</h1>
    <p style="font-size: 1.3rem; margin-bottom: 2.5rem; opacity: 0.9;">${prompt}</p>
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button style="background: white; color: #667eea; border: none; padding: 15px 35px; font-size: 1.1rem; border-radius: 8px; cursor: pointer; font-weight: bold;">
        Get Started
      </button>
      <button style="background: transparent; color: white; border: 2px solid white; padding: 15px 35px; font-size: 1.1rem; border-radius: 8px; cursor: pointer; font-weight: bold;">
        Learn More
      </button>
    </div>
  </div>
</section>`;
  }
  
  if (lowerPrompt.includes('contact') || lowerPrompt.includes('form')) {
    return `<!-- Contact Form: ${prompt} -->
<div style="max-width: 500px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Contact Us</h2>
  <form style="display: flex; flex-direction: column; gap: 1rem;">
    <input type="text" placeholder="Your Name" style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
    <input type="email" placeholder="Your Email" style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
    <textarea placeholder="Your Message" rows="4" style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; resize: vertical;"></textarea>
    <button type="submit" style="background: #667eea; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 1rem; cursor: pointer; font-weight: bold;">
      Send Message
    </button>
  </form>
</div>`;
  }
  
  if (lowerPrompt.includes('card')) {
    return `<!-- Card Component: ${prompt} -->
<div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 350px; margin: 1rem;">
  <div style="background: #667eea; height: 200px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
    Image
  </div>
  <div style="padding: 1.5rem;">
    <h3 style="margin-bottom: 0.5rem; color: #333; font-size: 1.3rem;">Card Title</h3>
    <p style="color: #666; margin-bottom: 1.5rem;">${prompt}</p>
    <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">
      Learn More
    </button>
  </div>
</div>`;
  }

  // Default component
  return `<!-- Component: ${prompt} -->
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 2rem; text-align: center; border-radius: 12px; margin: 1rem 0;">
  <h2 style="margin-bottom: 1rem; font-size: 2rem;">${prompt}</h2>
  <p style="margin-bottom: 2rem; opacity: 0.9;">Beautiful, responsive component</p>
  <button style="background: white; color: #667eea; border: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; cursor: pointer;">
    Get Started
  </button>
</div>`;
}








