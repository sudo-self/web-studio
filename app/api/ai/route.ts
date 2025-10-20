// --- app/api/ai/route.ts ---
import { NextRequest, NextResponse } from "next/server";

// Google Gemini API - Free tier with generous limits
const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim() || "";
    
    if (!prompt) {
      return NextResponse.json({ text: "No prompt provided" }, { status: 400 });
    }

    // If no API key, use local fallback generation
    if (!GEMINI_API_KEY) {
      console.log("No Gemini API key - using local generation");
      const localComponent = generateLocalComponent(prompt);
      return NextResponse.json({ text: localComponent });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a web development expert. Generate clean, responsive HTML/CSS code.
                  
                  RULES:
                  - Return ONLY HTML code with inline CSS
                  - No explanations, no markdown, no backticks
                  - Use modern, responsive design
                  - Include proper semantic HTML
                  - Make it mobile-friendly
                  - Use inline styles only
                  - Do not include any text outside of HTML tags
                  - Ensure the code is complete and valid
                  
                  Create this web component: ${prompt}. Return only HTML with inline CSS.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      
      // Fallback to local generation if API fails
      const localComponent = generateLocalComponent(prompt);
      return NextResponse.json({ text: localComponent });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!generatedText) {
      throw new Error("No content generated");
    }

    // Clean the response
    const cleanCode = cleanAIResponse(generatedText);
    
    return NextResponse.json({ text: cleanCode });

  } catch (err) {
    console.error("API error:", err);
    
    // Always return a valid component, even on error
    const fallbackComponent = generateLocalComponent("Component");
    return NextResponse.json({ 
      text: fallbackComponent,
      error: "AI service temporarily unavailable"
    });
  }
}

function cleanAIResponse(text: string): string {
  let cleaned = text
    .replace(/^```(?:html|js|css)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^`|`$/g, '')
    .trim();

  // If it looks like HTML, ensure it's properly formatted
  if (cleaned.includes('<') && cleaned.includes('>')) {
    const firstTagIndex = cleaned.indexOf('<');
    if (firstTagIndex > 0) {
      cleaned = cleaned.substring(firstTagIndex);
    }
  }

  return cleaned || generateLocalComponent("Component");
}

function generateLocalComponent(prompt: string): string {
  const components = [
    `<!-- ${prompt} -->
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 2rem; text-align: center; border-radius: 12px;">
  <h2 style="margin-bottom: 1rem; font-size: 2rem;">${prompt}</h2>
  <p style="margin-bottom: 2rem; opacity: 0.9;">Beautiful component for your website</p>
  <button style="background: white; color: #667eea; border: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; cursor: pointer;">
    Get Started
  </button>
</div>`,

    `<!-- ${prompt} -->
<div style="background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 2rem; max-width: 400px;">
  <h3 style="color: #333; margin-bottom: 1rem;">${prompt}</h3>
  <p style="color: #666; margin-bottom: 1.5rem;">This component was generated based on your request.</p>
  <div style="display: flex; gap: 1rem;">
    <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
      Primary
    </button>
    <button style="background: transparent; color: #667eea; border: 1px solid #667eea; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
      Secondary
    </button>
  </div>
</div>`,

    `<!-- ${prompt} -->
<section style="padding: 4rem 2rem; background: #f8fafc;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">${prompt}</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🚀</div>
        <h3 style="color: #333; margin-bottom: 1rem;">Feature One</h3>
        <p style="color: #666;">Description of this great feature</p>
      </div>
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">💡</div>
        <h3 style="color: #333; margin-bottom: 1rem;">Feature Two</h3>
        <p style="color: #666;">Another amazing feature description</p>
      </div>
    </div>
  </div>
</section>`
  ];

  // Return a random component template
  return components[Math.floor(Math.random() * components.length)];
}


