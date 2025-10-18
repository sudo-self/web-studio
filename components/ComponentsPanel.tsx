// --- components/ComponentsPanel.tsx ---

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
    header: `<!-- Header Component -->
<header style="background-color: #333; color: white; padding: 1rem;">
  <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
    <h1 style="margin: 0;">My Website</h1>
    <nav>
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Home</a>
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">About</a>
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Contact</a>
    </nav>
  </div>
</header>`,
    
    hero: `<!-- Hero Section -->
<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Welcome to Our Website</h2>
    <p style="font-size: 1.2rem; margin-bottom: 2rem;">We create amazing digital experiences</p>
    <button style="background: white; color: #333; border: none; padding: 12px 30px; font-size: 1rem; border-radius: 5px; cursor: pointer;">Get Started</button>
  </div>
</section>`,
    
    about: `<!-- About Section -->
<section style="padding: 4rem 2rem; background-color: #f9f9f9;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">About Us</h2>
    <p style="line-height: 1.6; margin-bottom: 1rem; color: #666;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <p style="line-height: 1.6; color: #666;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
  </div>
</section>`,
    
    services: `<!-- Services Section -->
<section style="padding: 4rem 2rem; background-color: white;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Our Services</h2>
    <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem;">
      <div style="flex: 1; min-width: 250px; background: #f9f9f9; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="color: #333;">Web Design</h3>
        <p style="color: #666;">Beautiful and responsive web designs.</p>
      </div>
      <div style="flex: 1; min-width: 250px; background: #f9f9f9; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="color: #333;">Development</h3>
        <p style="color: #666;">Custom web applications.</p>
      </div>
    </div>
  </div>
</section>`,
    
    contact: `<!-- Contact Form -->
<section style="padding: 4rem 2rem; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Contact Us</h2>
    <form style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 5px; color: #333;">Name</label>
        <input type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 5px; color: #333;">Email</label>
        <input type="email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      <button type="submit" style="background: #333; color: white; border: none; padding: 12px 30px; border-radius: 4px; cursor: pointer; width: 100%;">Send Message</button>
    </form>
  </div>
</section>`,
    
    footer: `<!-- Footer -->
<footer style="background-color: #333; color: white; padding: 2rem; text-align: center;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <p>&copy; 2023 My Website. All rights reserved.</p>
    <div style="margin-top: 1rem;">
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Privacy Policy</a>
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Terms of Service</a>
    </div>
  </div>
</footer>`,
    
    card: `<!-- Card Component -->
<div style="background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 300px; margin: 0 auto;">
  <img src="https://via.placeholder.com/300x200" alt="Card Image" style="width: 100%; height: auto;">
  <div style="padding: 1.5rem;">
    <h3 style="margin-bottom: 0.5rem; color: #333;">Card Title</h3>
    <p style="color: #666; margin-bottom: 1rem;">This is a sample card with example content.</p>
    <button style="background: #333; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Learn More</button>
  </div>
</div>`,
    
    gallery: `<!-- Image Gallery -->
<section style="padding: 2rem; background-color: white;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Image Gallery</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
      <img src="https://via.placeholder.com/200" alt="Gallery Image" style="width: 100%; height: auto; border-radius: 8px;">
      <img src="https://via.placeholder.com/200" alt="Gallery Image" style="width: 100%; height: auto; border-radius: 8px;">
    </div>
  </div>
</section>`
  };

  const askAi = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("Thinking...");

    try {
      let aiText = "";

      if (mode === "response") {
        const res = await fetch("http://10.0.0.20:1234/v1/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "default",
            input: `Generate HTML code for: ${prompt}. Return only the HTML code without explanations.`,
          }),
        });
        const data = await res.json();
        aiText = data.output_text || data.output?.[0]?.content?.[0]?.text || "No response";
      } else {
        const updatedHistory = [
          ...chatHistory,
          { role: "user", content: prompt },
        ];
        const res = await fetch("http://10.0.0.20:1234/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "default",
            messages: [
              {
                role: "system",
                content: "You are a web development assistant. Return only HTML/CSS/JavaScript code without explanations."
              },
              ...updatedHistory
            ],
          }),
        });
        const data = await res.json();
        aiText = data.choices?.[0]?.message?.content?.trim() || "No response";

        setChatHistory([
          ...updatedHistory,
          { role: "assistant", content: aiText },
        ]);
      }

      setResponse(aiText);
      if (aiText && !aiText.includes("No response")) {
        onAiInsert(`\n<!-- AI Generated -->\n${aiText}\n`);
      }
    } catch (err) {
      console.error(err);
      setResponse("Error connecting to AI server. Make sure LM Studio is running.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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

      {/* AI Assistant Section */}
      <div className="ai-section">
        <h3>AI Assistant</h3>

        {/* Mode Switch */}
        <div className="mode-switch">
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
          <label>
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
          className="ai-prompt"
          placeholder="Ask AI to generate or modify code..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={askAi} 
          disabled={loading} 
          style={{ 
            background: '#cba6f7', 
            color: '#1e1e2e', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? "Asking AI..." : "Ask AI"}
        </button>

        {/* AI Response */}
        <div className="ai-response">
          {response}
        </div>

        {/* Chat History */}
        {mode === "chat" && chatHistory.length > 0 && (
          <div className="chat-history">
            <strong>Chat History:</strong>
            {chatHistory.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <b>{msg.role}:</b> {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

