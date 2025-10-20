import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim() || "";

    if (!prompt) return NextResponse.json({ text: "" }, { status: 400 });

    if (!GEMINI_API_KEY) {
      console.warn("No Gemini API key - returning empty string");
      return NextResponse.json({ text: "" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a senior front-end developer.
Return ONLY a single valid HTML block with inline CSS.
No markdown, backticks, comments, or extra text.
Make it semantic, responsive, mobile-friendly.
Generate this component: ${prompt}
                `
                }
              ]
            }
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return NextResponse.json({ text: "" });
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    const cleaned = cleanAIResponse(raw);

    return NextResponse.json({ text: cleaned });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ text: "" });
  }
}

function cleanAIResponse(text: string): string {
  let cleaned = text
    .replace(/```(?:html|css|js)?/gi, "")
    .replace(/```/g, "")
    .replace(/`/g, "")
    .trim();

  if (cleaned.includes("<") && cleaned.includes(">")) {
    const firstTagIndex = cleaned.indexOf("<");
    if (firstTagIndex > 0) cleaned = cleaned.substring(firstTagIndex);
  }

  return cleaned;
}




