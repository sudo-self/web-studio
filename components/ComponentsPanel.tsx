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
</section>`,

    seo: `<!-- SEO Meta Tags -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Website Title</title>
  <meta name="description" content="Your website description for SEO">
  <meta name="keywords" content="your, keywords, here">
  <meta name="author" content="Your Name">
  <meta property="og:title" content="Your Website Title">
  <meta property="og:description" content="Your website description">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yourwebsite.com">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Your Website Title">
  <meta name="twitter:description" content="Your website description">
  <link rel="canonical" href="https://yourwebsite.com">
</head>`,

    "seo-schema": `<!-- Schema.org Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Website Name",
  "url": "https://yourwebsite.com",
  "description": "Your website description",
  "publisher": {
    "@type": "Organization",
    "name": "Your Organization"
  }
}
</script>`,

    "social-icons": `<!-- Social Media Icons -->
<div style="display: flex; gap: 15px; justify-content: center; padding: 2rem;">
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">📘</a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">🐦</a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">📷</a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">💼</a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">📺</a>
</div>`,

    "feature-icons": `<!-- Feature Icons Section -->
<section style="padding: 4rem 2rem; background-color: #f8fafc;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Our Features</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 1rem;">⚡</div>
        <h3 style="color: #333; margin-bottom: 1rem;">Fast Performance</h3>
        <p style="color: #666;">Lightning fast loading times and smooth interactions.</p>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 1rem;">🔒</div>
        <h3 style="color: #333; margin-bottom: 1rem;">Secure</h3>
        <p style="color: #666;">Enterprise-grade security for your peace of mind.</p>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 1rem;">📱</div>
        <h3 style="color: #333; margin-bottom: 1rem;">Responsive</h3>
        <p style="color: #666;">Looks great on all devices and screen sizes.</p>
      </div>
    </div>
  </div>
</section>`,

    "font-icons": `<!-- Font Awesome Icons (CDN) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<div style="display: flex; gap: 20px; justify-content: center; padding: 2rem;">
  <i class="fas fa-home" style="font-size: 24px; color: #333;"></i>
  <i class="fas fa-envelope" style="font-size: 24px; color: #333;"></i>
  <i class="fas fa-phone" style="font-size: 24px; color: #333;"></i>
  <i class="fas fa-share-alt" style="font-size: 24px; color: #333;"></i>
</div>`
  };

  const componentCategories = {
    "Layout": ["header", "hero", "about", "services", "contact", "footer"],
    "Content": ["card", "gallery"],
    "SEO": ["seo", "seo-schema"],
    "Icons": ["social-icons", "feature-icons", "font-icons"]
  };

  const getComponentIcon = (componentKey: string) => {
    const icons: { [key: string]: string } = {
      header: "📄", hero: "🌟", about: "ℹ️", services: "🛠️",
      contact: "📞", footer: "⬇️", card: "🃏", gallery: "🖼️",
      seo: "🔍", "seo-schema": "🏷️", "social-icons": "👥",
      "feature-icons": "⭐", "font-icons": "🔤"
    };
    return icons[componentKey] || "📦";
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
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "hidden",
    }}>
      {/* Components List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "1rem",
      }}>
        {Object.entries(componentCategories).map(([category, keys]) => (
          <div key={category} style={{ marginBottom: "1.5rem" }}>
            <h4 style={{
              color: "#89b4fa",
              fontWeight: 600,
              marginBottom: "0.5rem",
              textTransform: "uppercase"
            }}>{category}</h4>
            {keys.map((key) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  marginBottom: "0.25rem"
                }}
                onClick={() => onInsert(components[key as keyof typeof components])}
              >
                <span>{getComponentIcon(key)}</span>
                <span>{key.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* AI Section */}
      <div style={{
        flexShrink: 0,
        padding: "1rem",
        borderTop: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxHeight: "50%",
        overflowY: "auto",
      }}>
        <h3>AI Assistant</h3>

        {/* Mode Switch */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <label>
            <input type="radio" value="response" checked={mode === "response"} onChange={() => setMode("response")} /> Stateless
          </label>
          <label>
            <input type="radio" value="chat" checked={mode === "chat"} onChange={() => setMode("chat")} /> Chat
          </label>
        </div>

        {/* Prompt */}
        <textarea
          placeholder="Ask AI to generate or modify code..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) askAi();
          }}
          style={{ width: "100%", minHeight: "60px", padding: "0.5rem" }}
        />

        {/* Ask AI Button */}
        <button
          onClick={askAi}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.5rem",
            background: "#cba6f7",
            color: "#1e1e2e",
            fontWeight: 600,
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "🤖 Asking AI..." : "🤖 Ask AI"}
        </button>

        {/* AI Response */}
        <pre style={{
          background: "#f4f4f4",
          padding: "0.5rem",
          minHeight: "60px",
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word"
        }}>
          {response || "AI responses will appear here..."}
        </pre>

        {/* Chat History */}
        {mode === "chat" && chatHistory.length > 0 && (
          <div style={{ marginTop: "0.5rem", maxHeight: "150px", overflowY: "auto" }}>
            <strong>Chat History:</strong>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{
                fontSize: "0.85rem",
                color: msg.role === "user" ? "#333" : "#666",
                marginTop: "0.25rem"
              }}>
                <b>{msg.role}:</b> {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

