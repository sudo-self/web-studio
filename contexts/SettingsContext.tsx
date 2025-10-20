const askAI = async (prompt: string, onChunk?: (chunk: string) => void) => {
  if (!prompt.trim()) return "";

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.body) throw new Error("No response body from AI API");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      aiText += chunk;
      if (onChunk) onChunk(chunk); // send chunks to UI in real time
    }

    // Strip markdown/code fences
    const cleanedText = aiText
      .replace(/^```(?:html|js|css)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return cleanedText || "No response from AI";
  } catch (err) {
    console.error("AI streaming failed:", err);
    return "Error contacting AI";
  }
};









