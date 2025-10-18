"use client";

import { useState } from "react";
import {
  FileText,       // header
  Sparkles,       // hero
  Info,           // about
  Wrench,         // services
  Phone,          // contact
  SquareStack,    // footer
  CreditCard,     // card
  Image,          // gallery
  Search,         // seo
  Tag,            // seo-schema
  Users,          // social-icons
  Stars,          // feature-icons
  Type,           // font-icons
  Bot,            // AI assistant
  Zap,            // feature icon
  Shield,
  Smartphone,
  Home,
  Mail,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";

type AiMode = "response" | "chat";

interface Component {
  [key: string]: string;
}

interface ComponentCategories {
  [key: string]: string[];
}

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

  const components: Component = {
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
    <p>&copy; 2024 My Website. All rights reserved.</p>
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

    "social-icons": `<!-- Social Media Icons with Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<div style="display: flex; gap: 15px; justify-content: center; padding: 2rem;">
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-facebook"></i>
  </a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-twitter"></i>
  </a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-instagram"></i>
  </a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-linkedin"></i>
  </a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-youtube"></i>
  </a>
</div>`,

    "feature-icons": `<!-- Feature Icons Section -->
<section style="padding: 4rem 2rem; background-color: #f8fafc;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Our Features</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
      <div style="text-align: center;">
        <div style="margin-bottom: 1rem; color: #667eea;">
          <i class="fas fa-bolt" style="font-size: 48px;"></i>
        </div>
        <h3 style="color: #333; margin-bottom: 1rem;">Fast Performance</h3>
        <p style="color: #666;">Lightning fast loading times and smooth interactions.</p>
      </div>
      <div style="text-align: center;">
        <div style="margin-bottom: 1rem; color: #667eea;">
          <i class="fas fa-shield-alt" style="font-size: 48px;"></i>
        </div>
        <h3 style="color: #333; margin-bottom: 1rem;">Secure</h3>
        <p style="color: #666;">Enterprise-grade security for your peace of mind.</p>
      </div>
      <div style="text-align: center;">
        <div style="margin-bottom: 1rem; color: #667eea;">
          <i class="fas fa-mobile-alt" style="font-size: 48px;"></i>
        </div>
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

  const componentCategories: ComponentCategories = {
    "Layout": ["header", "hero", "about", "services", "contact", "footer"],
    "Content": ["card", "gallery"],
    "SEO": ["seo", "seo-schema"],
    "Icons": ["social-icons", "feature-icons", "font-icons"]
  };

  const getComponentIcon = (componentKey: string): JSX.Element => {
    const icons: { [key: string]: JSX.Element } = {
      header: <FileText size={16} />,
      hero: <Sparkles size={16} />,
      about: <Info size={16} />,
      services: <Wrench size={16} />,
      contact: <Phone size={16} />,
      footer: <SquareStack size={16} />,
      card: <CreditCard size={16} />,
      gallery: <Image size={16} />,
      seo: <Search size={16} />,
      "seo-schema": <Tag size={16} />,
      "social-icons": <Users size={16} />,
      "feature-icons": <Stars size={16} />,
      "font-icons": <Type size={16} />,
    };
    return icons[componentKey] || <FileText size={16} />;
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

        // Clean up the response by removing code block formatting
        let cleanedText = aiText
          .replace(/^```html\s*/i, '')  // Remove starting ```html
          .replace(/^```\s*/i, '')      // Remove starting ```
          .replace(/\s*```$/i, '')      // Remove ending ```
          .trim();

        setResponse(cleanedText);
        if (cleanedText && !cleanedText.includes("No response")) {
          onAiInsert(`\n<!-- AI Generated -->\n${cleanedText}\n`);
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
                textTransform: "uppercase",
                fontSize: "0.875rem",
                letterSpacing: "0.05em"
              }}>
                {category}
              </h4>
              {keys.map((key) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    marginBottom: "0.5rem",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(137, 180, 250, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onClick={() => onInsert(components[key])}
                >
                  <div style={{ color: "#89b4fa", display: "flex", alignItems: "center" }}>
                    {getComponentIcon(key)}
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "var(--foreground)" }}>
                    {key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* AI Section */}
        <div style={{
          flexShrink: 0,
          height: "50%",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid var(--panel-border)",
        }}>
          <div style={{
            padding: "1rem",
            borderBottom: "1px solid var(--panel-border)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Bot size={18} style={{ color: "#89b4fa" }} />
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>AI Assistant</h3>
            </div>
          </div>

          {/* Scrollable AI Content */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}>
            {/* Mode Switch */}
            <div style={{
              display: "flex",
              gap: "1rem",
              fontSize: "0.875rem"
            }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  value="response"
                  checked={mode === "response"}
                  onChange={() => setMode("response")}
                />
                Stateless
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  value="chat"
                  checked={mode === "chat"}
                  onChange={() => setMode("chat")}
                />
                Chat
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
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid var(--panel-border)",
                backgroundColor: "var(--component-bg)",
                color: "var(--foreground)",
                fontSize: "0.875rem",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />

            {/* Ask AI Button */}
            <button
              onClick={askAi}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: loading ? "#a6a6a6" : "#cba6f7",
                color: "#1e1e2e",
                fontWeight: 600,
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "background-color 0.2s",
                flexShrink: 0,
              }}
            >
              <Bot size={16} />
              {loading ? "Asking AI..." : "Ask AI"}
            </button>

            {/* AI Response */}
            {response && (
              <div style={{
                background: "var(--panel-bg)",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid var(--panel-border)",
                flexShrink: 0,
              }}>
                <div style={{
                  fontSize: "0.75rem",
                  color: "#89b4fa",
                  fontWeight: 600,
                  marginBottom: "0.5rem"
                }}>
                  AI RESPONSE:
                </div>
                <pre style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  color: "var(--foreground)",
                  fontFamily: "var(--font-mono)",
                  lineHeight: "1.4",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}>
                  {response}
                </pre>
              </div>
            )}

            {/* Chat History */}
            {mode === "chat" && chatHistory.length > 0 && (
              <div style={{
                fontSize: "0.75rem",
                flexShrink: 0,
              }}>
                <div style={{
                  color: "#89b4fa",
                  fontWeight: 600,
                  marginBottom: "0.5rem"
                }}>
                  CHAT HISTORY:
                </div>
                <div style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem"
                }}>
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "4px",
                        backgroundColor: msg.role === "user" ? "var(--component-bg)" : "var(--panel-bg)",
                        border: "1px solid var(--panel-border)",
                      }}
                    >
                      <div style={{
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        color: msg.role === "user" ? "#89b4fa" : "#cba6f7",
                        marginBottom: "0.25rem"
                      }}>
                        {msg.role.toUpperCase()}:
                      </div>
                      <div style={{
                        fontSize: "0.7rem",
                        lineHeight: "1.3",
                        color: "var(--foreground)"
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
