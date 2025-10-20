// --- app/api/ai/route.ts ---

import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim() || "";
    
    if (!prompt) {
      return NextResponse.json({ text: "No prompt provided" }, { status: 400 });
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ 
        text: "DeepSeek API key not configured. Please add DEEPSEEK_API_KEY to your environment variables." 
      }, { status: 500 });
    }

    const messages = [
      {
        role: "system",
        content: `You are a web development expert. Generate clean, responsive HTML/CSS code.
        Rules:
        1. Return ONLY HTML code with inline CSS
        2. No explanations, no markdown, no backticks
        3. Use modern, responsive design
        4. Include proper semantic HTML
        5. Make it mobile-friendly
        6. Use inline styles only
        7. Do not include any text outside of HTML tags
        8. Ensure the code is complete and valid`
      },
      ...(body.mode === "chat" ? body.chatHistory || [] : []),
      { 
        role: "user", 
        content: `Create this web component: ${prompt}. Return only HTML with inline CSS.` 
      }
    ];

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
        stream: true
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("DeepSeek API error:", {
        status: res.status,
        statusText: res.statusText,
        error: errorText
      });
      
      if (res.status === 401) {
        return NextResponse.json({ 
          text: "DeepSeek API authentication failed. Please check your API key." 
        }, { status: 401 });
      } else if (res.status === 429) {
        return NextResponse.json({ 
          text: "DeepSeek rate limit exceeded. Please try again later." 
        }, { status: 429 });
      } else {
        return NextResponse.json({ 
          text: `DeepSeek API error (${res.status}): ${errorText}` 
        }, { status: res.status });
      }
    }

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error("No response body received from DeepSeek");
    }

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                  const data = JSON.parse(line.slice(6));
                  const content = data.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch (e) {
                  console.warn("Failed to parse SSE chunk:", line);
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream reading error:", error);
          controller.error(error);
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
      cancel() {
        reader.cancel();
      }
    });

    return new Response(stream, {
      headers: { 
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Content-Type-Options": "nosniff"
      }
    });

  } catch (err) {
    console.error("API error:", err);
    
    const fallbackComponent = `<!-- Fallback Component - AI Service Temporarily Unavailable -->
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 2rem; text-align: center; border-radius: 12px; margin: 1rem 0;">
  <h2 style="margin-bottom: 1rem; font-size: 1.8rem; font-weight: 600;">Component</h2>
  <p style="margin-bottom: 2rem; opacity: 0.9; font-size: 1.1rem;">AI service temporarily unavailable. Using fallback component.</p>
  <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
    <button style="background: white; color: #667eea; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;">
      Primary Action
    </button>
    <button style="background: transparent; color: white; border: 2px solid white; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;">
      Secondary Action
    </button>
  </div>
</div>`;
    
    return NextResponse.json({ 
      text: fallbackComponent,
      error: "Server error: " + (err instanceof Error ? err.message : "Unknown error")
    }, { status: 500 });
  }
}


