"use client";

import { useState } from "react";

type AiMode = "response" | "chat";

export default function ComponentsPanel({
  onInsert,
  onAiInsert,
}: {
  onInsert: (code: string) => void;
  onAiInsert: (code: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState<AiMode>("response");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const components = {
    header: "<header><h1>My Website</h1></header>",
    hero: "<section><h2>Hero Section</h2><p>Welcome to my site.</p></section>",
    about: "<section><h2>About Us</h2><p>We are awesome.</p></section>",
    services:
      "<section><h2>Services</h2><ul><li>Service A</li><li>Service B</li></ul></section>",
    contact:
      "<form><input type='text' placeholder='Your Name' /><button>Submit</button></form>",
    footer: "<footer><p>© 2025 My Website</p></footer>",
    card: "<div class='card'><h3>Card Title</h3><p>Card content.</p></div>",
    gallery:
      "<div class='gallery'><img src='https://via.placeholder.com/150' /></div>",
  };

  const askAi = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("Thinking...");

    try {
      let aiText = "";

      if (mode === "response") {
        // Stateless mode
        const res = await fetch("http://10.0.0.20:1234/v1/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "default",
            input: `Generate HTML code for: ${prompt}`,
          }),
        });
        const data = await res.json();
        aiText =
          data.output_text ||
          data.output?.[0]?.content?.[0]?.text ||
          "No response";
      } else {
        // Chat mode
        const updatedHistory = [
          ...chatHistory,
          { role: "user", content: prompt },
        ];
        const res = await fetch("http://10.0.0.20:1234/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "default",
            messages: updatedHistory,
          }),
        });
        const data = await res.json();
        aiText =
          data.choices?.[0]?.message?.content?.trim() || "No response";

        // Save chat history
        setChatHistory([
          ...updatedHistory,
          { role: "assistant", content: aiText },
        ]);
      }

      setResponse(aiText);
      if (aiText) onAiInsert(aiText);
    } catch (err) {
      console.error(err);
      setResponse("Error connecting to AI server");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="panel components-panel">
      <div className="panel-header">
        <h2>Components</h2>
      </div>
      <div className="components-list">
        {Object.entries(components).map(([key, html]) => (
          <div
            key={key}
            className="component-item"
            onClick={() => onInsert(html)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        ))}
      </div>

      {/* --- AI Assistant Section --- */}
      <div style={{ marginTop: "20px" }}>
        <h3>AI Assistant</h3>

        {/* Mode Switch */}
        <div style={{ marginBottom: "8px" }}>
          <label>
            <input
              type="radio"
              name="mode"
              value="response"
              checked={mode === "response"}
              onChange={() => setMode("response")}
            />
            Stateless
          </label>
          <label style={{ marginLeft: "12px" }}>
            <input
              type="radio"
              name="mode"
              value="chat"
              checked={mode === "chat"}
              onChange={() => setMode("chat")}
            />
            Chat
          </label>
        </div>

        {/* Prompt Input */}
        <textarea
          placeholder="Ask AI to generate or modify code..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", height: "80px", marginTop: "8px", padding: "6px" }}
        />
        <button onClick={askAi} disabled={loading} style={{ marginTop: "8px", padding: "6px" }}>
          {loading ? "Asking..." : "Ask AI"}
        </button>

        {/* AI Output */}
        <div style={{ marginTop: "10px", fontSize: "13px", whiteSpace: "pre-wrap" }}>
          {response}
        </div>

        {/* Chat History (if chat mode) */}
        {mode === "chat" && chatHistory.length > 0 && (
          <div style={{ marginTop: "12px", fontSize: "12px", maxHeight: "150px", overflowY: "auto" }}>
            <strong>Chat History:</strong>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ marginTop: "4px" }}>
                <b>{msg.role}:</b> {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

