import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode, chatHistory } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ text: "No prompt provided" }, { status: 400 });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "https://ai-web-studio.netlify.app",
        "X-Title": "Website Builder"
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5:free", // Most reliable free model
        messages: [
          {
            role: "system",
            content: `You are a web development expert. Generate clean, responsive HTML/CSS code.
            Rules:
            1. Return ONLY HTML code with inline CSS
            2. No explanations, no markdown, no backticks
            3. Use modern, responsive design
            4. Include proper semantic HTML
            5. Make it mobile-friendly
            6. Use inline styles only`
          },
          ...(mode === "chat" ? chatHistory : []),
          { 
            role: "user", 
            content: `Create this web component: ${prompt}. Return only HTML with inline CSS.` 
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        stream: true
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ 
        text: `OpenRouter API error: ${JSON.stringify(errorData)}` 
      }, { status: res.status });
    }

    const reader = res.body?.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { value, done } = await reader!.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(chunk);
          }
        } catch (error) {
          console.error("Stream reading error:", error);
        } finally {
          controller.close();
        }
      },
      cancel() {
        reader?.cancel();
      }
    });

    return new Response(stream, {
      headers: { 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ 
      text: "Server error: " + (err instanceof Error ? err.message : "Unknown error")
    }, { status: 500 });
  }
}


