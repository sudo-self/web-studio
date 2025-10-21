// --- app/api/ai/route.ts ---
import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = "https://llm.jessejesse.workers.dev/api/chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Create messages array for your worker
    const messages = [
      {
        role: "user" as const,
        content: `You are an expert web developer. Create responsive HTML with inline CSS for: "${prompt}"

CRITICAL: Return ONLY the HTML code with inline styles. No explanations, no markdown formatting, no backticks. Just pure HTML that can be directly rendered in a browser.`
      }
    ];

    console.log("Calling worker with prompt:", prompt);

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    console.log("Worker response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Worker error response:", errorText);
      throw new Error(`Worker API error: ${response.status} - ${errorText}`);
    }

    // Handle streaming response from your worker
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body received");
    }

    let fullContent = '';
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.response) {
                fullContent += data.response;
              }
            } catch (e) {
              // Skip invalid JSON lines
              console.log("Skipping non-JSON line:", line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    console.log("Raw worker response:", fullContent);

    if (!fullContent.trim()) {
      throw new Error("Worker returned empty response");
    }

    // Clean the response - remove any markdown formatting
    const cleaned = fullContent
      .replace(/```(html|css|js)?/gi, '')
      .replace(/```/g, '')
      .replace(/^`|`$/g, '')
      .trim();

    return NextResponse.json({ 
      text: cleaned,
      success: true 
    });

  } catch (err) {
    console.error("API Error:", err);
    
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    
    return NextResponse.json(
      { 
        text: "",
        error: errorMessage,
        success: false
      },
      { status: 500 }
    );
  }
}








