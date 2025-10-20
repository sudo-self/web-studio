// app/api/route.ts

import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ text: "No prompt provided." }, { status: 400 });
    }

    // Call OpenRouter
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { text: `OpenRouter API error: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const aiText = data.choices?.[0]?.message?.content || "No response from AI";

    return NextResponse.json({ text: aiText });

  } catch (err) {
    console.error("API route failed:", err);
    return NextResponse.json(
      { text: "Server error contacting AI." },
      { status: 500 }
    );
  }
}


