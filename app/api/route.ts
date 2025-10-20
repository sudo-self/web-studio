import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode, chatHistory } = await req.json();

    if (!prompt?.trim()) return NextResponse.json({ text: "No prompt provided" }, { status: 400 });

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "system",
            content: "You are a professional web development assistant. Return only HTML/CSS/JS code. No explanations."
          },
          ...(mode === "chat" ? chatHistory : []),
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: true
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ text: `OpenRouter API error: ${errorText}` }, { status: res.status });
    }

    // Stream response back to client
    const reader = res.body?.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder("utf-8");
        while (true) {
          const { value, done } = await reader!.read();
          if (done) break;
          const chunk = decoder.decode(value);
          controller.enqueue(chunk);
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" }
    });

  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ text: "Server error contacting AI" }, { status: 500 });
  }
}


