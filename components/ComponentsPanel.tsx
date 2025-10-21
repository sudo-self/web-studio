"use client";

import { useState, useMemo, useEffect } from "react";
import { ReactElement } from "react";
import {
  FileText,
  Sparkles,
  Info,
  Wrench,
  Phone,
  SquareStack,
  CreditCard,
  Image,
  Search,
  Tag,
  Users,
  Stars,
  Type,
  Bot,
  Settings,
  Navigation,
  Sidebar,
  BarChart3,
  Mail,
  HelpCircle,
  TrendingUp,
  Clock,
  Star,
  StarOff,
  Eye,
  X,
} from "lucide-react";

import { useSettings } from "@/contexts/SettingsContext";

type AiMode = "response" | "chat";
type ChatRole = "user" | "assistant";

interface ComponentInfo {
  code: string;
  description: string;
  tags: string[];
}

interface ComponentCategories {
  [key: string]: string[];
}

interface ComponentsPanelProps {
  onInsert: (code: string) => void;
  onAiInsert: (code: string) => void;
  onOpenSettings: () => void;
  onResizeStart?: (e: React.MouseEvent) => void;
}

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const components: { [key: string]: ComponentInfo } = {
  header: {
    code: `<!-- Header Component -->
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
    description: "Website header with navigation",
    tags: ["layout", "navigation", "header"]
  },
  hero: {
    code: `<!-- Hero Section -->
<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Welcome to Our Website</h2>
    <p style="font-size: 1.2rem; margin-bottom: 2rem;">We create amazing digital experiences</p>
    <button style="background: white; color: #333; border: none; padding: 12px 30px; font-size: 1rem; border-radius: 5px; cursor: pointer;">Get Started</button>
  </div>
</section>`,
    description: "Hero section with call-to-action",
    tags: ["layout", "hero", "cta"]
  },
  card: {
    code: `<!-- Card Component -->
<div style="background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 300px; margin: 0 auto;">
  <img src="https://via.placeholder.com/300x200" alt="Card Image" style="width: 100%; height: auto;">
  <div style="padding: 1.5rem;">
    <h3 style="margin-bottom: 0.5rem; color: #333;">Card Title</h3>
    <p style="color: #666; margin-bottom: 1rem;">This is a sample card with example content.</p>
    <button style="background: #333; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Learn More</button>
  </div>
</div>`,
    description: "Card component with image and text",
    tags: ["ui", "card", "content"]
  },
};

const componentCategories: ComponentCategories = {
  "Layout": ["header", "hero"],
  "UI Components": ["card"],
};

const getComponentIcon = (componentKey: string): ReactElement => {
  const icons: { [key: string]: ReactElement } = {
    header: <FileText size={16} />,
    hero: <Sparkles size={16} />,
    card: <CreditCard size={16} />,
  };
  return icons[componentKey] || <FileText size={16} />;
};

const generateHtml = (bodyContent: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; 
          padding: 0; 
          min-height: 100vh; 
          background: #ffffff;
          line-height: 1.6;
        }
        * { box-sizing: border-box; }
      </style>
    </head>
    <body>${bodyContent}</body>
  </html>
`;

export default function ComponentsPanel({
  onInsert,
  onAiInsert,
  onOpenSettings,
  onResizeStart,
}: ComponentsPanelProps) {
  const { settings } = useSettings();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState<AiMode>("response");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewComponent, setPreviewComponent] = useState<string | null>(null);
  const [recentComponents, setRecentComponents] = useState<string[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedFavorites = localStorage.getItem('component-favorites');
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
      const savedRecent = localStorage.getItem('recent-components');
      if (savedRecent) {
        setRecentComponents(JSON.parse(savedRecent));
      }
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('component-favorites', JSON.stringify(Array.from(favorites)));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  const filteredComponents = useMemo(() => {
    if (!searchTerm) return componentCategories;
    const filtered: ComponentCategories = {};
    Object.entries(componentCategories).forEach(([category, comps]) => {
      const filteredComps = comps.filter(compKey => {
        const comp = components[compKey];
        return (
          compKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
      if (filteredComps.length > 0) {
        filtered[category] = filteredComps;
      }
    });
    return filtered;
  }, [searchTerm]);

  const toggleFavorite = (componentKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(componentKey)) {
        newFavorites.delete(componentKey);
      } else {
        newFavorites.add(componentKey);
      }
      return newFavorites;
    });
  };

  const handleInsert = (componentKey: string) => {
    const component = components[componentKey];
    if (!component) return;
    setRecentComponents(prev => {
      const filtered = prev.filter(key => key !== componentKey);
      const updated = [componentKey, ...filtered].slice(0, 10);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('recent-components', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save recent components:', e);
        }
      }
      return updated;
    });
    onInsert(component.code);
  };

  const askAi = async () => {
    if (!prompt.trim()) {
      setResponse("⚠️ Please enter a prompt");
      return;
    }
    if (isRequesting || loading) {
      console.log("Request already in progress, ignoring...");
      return;
    }
    setIsRequesting(true);
    setLoading(true);
    setResponse("");
    try {
      console.log("🚀 Sending AI request:", { 
        prompt: prompt.substring(0, 100), 
        mode, 
        endpoint: settings.aiEndpoint,
        timestamp: new Date().toISOString()
      });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(settings.aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          mode: mode,
          ...(mode === "chat" && chatHistory.length > 0 && { chatHistory })
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ AI API error:", res.status, errorText);
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      console.log("✅ AI response received:", { 
        hasText: !!data.text, 
        length: data.text?.length 
      });
      const aiText = data.text || "";
      if (!aiText.trim()) {
        throw new Error("AI returned empty response");
      }
      setResponse(aiText);
      if (aiText.includes('<') && aiText.includes('>')) {
        const timestamp = new Date().toLocaleTimeString();
        onAiInsert(`\n<!-- AI Generated (${timestamp}): ${prompt.substring(0, 50)}... -->\n${aiText}\n`);
      }
      if (mode === "chat") {
        setChatHistory(prev => [
          ...prev,
          { role: "user", content: prompt },
          { role: "assistant", content: aiText }
        ]);
      }
      setPrompt("");
    } catch (err) {
      console.error("💥 AI request failed:", err);
      let userMessage = "An error occurred";
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          userMessage = "Request timed out. Please try again.";
        } else if (err.message.includes('Failed to fetch')) {
          userMessage = "Network error. Check your connection.";
        } else if (err.message.includes('401') || err.message.includes('403')) {
          userMessage = "Authentication failed. Check your API key.";
        } else if (err.message.includes('429')) {
          userMessage = "Rate limit exceeded. Wait 10 seconds before trying again.";
        } else {
          userMessage = err.message;
        }
      }
      setResponse(`❌ Error: ${userMessage}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsRequesting(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {onResizeStart && (
        <div
          className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-accent-color hover:bg-opacity-50 transition-colors"
          onMouseDown={onResizeStart}
        />
      )}

      <div className="!p-2 border-b border-panel-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-medium text-text-secondary">
            <SquareStack size={12} />
            <span>Components</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchTerm(searchTerm ? '' : ' ')}
              className="!p-1.5 hover:bg-component-hover rounded transition-colors"
              title="Search"
            >
              <Search size={12} />
            </button>
            <button
              onClick={onOpenSettings}
              className="!p-1.5 hover:bg-component-hover rounded transition-colors"
              title="Settings"
            >
              <Settings size={12} />
            </button>
          </div>
        </div>
        {searchTerm !== '' && (
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Type to search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-2 pr-6 py-1 bg-component-bg border border-panel-border rounded text-xs focus:outline-none focus:border-accent-color text-foreground"
              autoFocus
            />
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-foreground text-xs"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <div className="components-list">
          {recentComponents.length > 0 && (
            <div className="component-category">
              <div className="category-title flex items-center gap-2">
                <Clock size={14} />
                Recently Used ({recentComponents.length})
              </div>
              {recentComponents.map((key) => (
                <div
                  key={key}
                  className="component-item group"
                  onClick={() => handleInsert(key)}
                >
                  <div className="component-icon">{getComponentIcon(key)}</div>
                  <span className="component-name flex-1">
                    {key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewComponent(key);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Preview component"
                    >
                      <Eye size={14} className="text-text-muted hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(key, e)}
                      className={`transition-opacity ${
                        favorites.has(key) ? "opacity-100 text-yellow-500" : "opacity-0 group-hover:opacity-100 text-text-muted"
                      }`}
                      title={favorites.has(key) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.has(key) ? (
                        <Star size={14} className="fill-yellow-500" />
                      ) : (
                        <Star size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {favorites.size > 0 && (
            <div className="component-category">
              <div className="category-title flex items-center gap-2">
                <Star size={14} className="text-yellow-500" />
                Favorites ({favorites.size})
              </div>
              {Array.from(favorites).map((key) => (
                <div
                  key={key}
                  className="component-item group"
                  onClick={() => handleInsert(key)}
                >
                  <div className="component-icon">{getComponentIcon(key)}</div>
                  <span className="component-name flex-1">
                    {key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewComponent(key);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Preview component"
                    >
                      <Eye size={14} className="text-text-muted hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(key, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-500"
                      title="Remove from favorites"
                    >
                      <StarOff size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {Object.entries(filteredComponents).map(([category, keys]) => (
            <div key={category} className="component-category">
              <div className="category-title">{category}</div>
              {keys.map((key) => (
                <div
                  key={key}
                  className="component-item group"
                  onClick={() => handleInsert(key)}
                >
                  <div className="component-icon">{getComponentIcon(key)}</div>
                  <span className="component-name flex-1">
                    {key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewComponent(key);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Preview component"
                    >
                      <Eye size={14} className="text-text-muted hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(key, e)}
                      className={`transition-opacity ${
                        favorites.has(key) ? "opacity-100 text-yellow-500" : "opacity-0 group-hover:opacity-100 text-text-muted"
                      }`}
                      title={favorites.has(key) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.has(key) ? (
                        <Star size={14} className="fill-yellow-500" />
                      ) : (
                        <Star size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {searchTerm && Object.keys(filteredComponents).length === 0 && (
            <div className="text-center py-8 text-text-muted">
              <Search size={32} className="mx-auto mb-2 opacity-50" />
              <p>No components found for "{searchTerm}"</p>
              <button onClick={() => setSearchTerm("")} className="btn btn-secondary btn-sm mt-2">
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {previewComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-panel-bg rounded-lg p-4 max-w-4xl w-full mx-auto max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Preview: {previewComponent.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
              </h3>
              <button onClick={() => setPreviewComponent(null)} className="text-text-muted hover:text-foreground">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 border rounded-lg overflow-hidden bg-white">
              <iframe
                srcDoc={generateHtml(components[previewComponent].code)}
                className="w-full h-full min-h-[400px]"
                title="Component Preview"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleInsert(previewComponent)} className="btn btn-primary flex-1">
                Insert Component
              </button>
              <button onClick={() => setPreviewComponent(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ai-section">
        <div className="panel-header">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Bot size={18} style={{ color: "var(--accent-color)" }} />
              <h3>AI Assistant</h3>
            </div>
            <div className="text-xs text-text-muted bg-component-bg px-2 py-1 rounded">
              Gemini 2.0
            </div>
          </div>
        </div>

        <div className="mode-toggle">
          <label className="mode-option">
            <input
              type="radio"
              value="response"
              checked={mode === "response"}
              onChange={() => setMode("response")}
              disabled={loading || isRequesting}
            />
            Stateless
          </label>
          <label className="mode-option">
            <input
              type="radio"
              value="chat"
              checked={mode === "chat"}
              onChange={() => setMode("chat")}
              disabled={loading || isRequesting}
            />
            Chat
          </label>
        </div>

        <div className="relative">
          <textarea
            className="prompt-textarea"
            placeholder="Describe what you want to create...

Examples:
• Hero section with blue gradient
• Pricing cards with 3 tiers
• Contact form with modern styling
• Navigation bar with dropdown"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (!isRequesting && !loading && prompt.trim()) {
                  askAi();
                }
              }
            }}
            disabled={loading || isRequesting}
          />
          <div className="text-xs text-text-muted mt-1 px-1 flex justify-between">
            <span>Press Ctrl/Cmd + Enter to send</span>
            {(loading || isRequesting) && <span className="text-accent-color">●</span>}
          </div>
        </div>

        <button
          className="btn btn-accent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isRequesting && !loading && prompt.trim()) {
              askAi();
            }
          }}
          disabled={loading || isRequesting || !prompt.trim()}
          style={{ opacity: (loading || isRequesting || !prompt.trim()) ? 0.5 : 1 }}
        >
          <Bot size={16} />
          {loading ? "Generating..." : isRequesting ? "Please wait..." : "Ask AI"}
        </button>

        {response && (
          <div>
            <div className="response-label">AI Response</div>
            <div className="ai-response">{response}</div>
          </div>
        )}

        {mode === "chat" && chatHistory.length > 0 && (
          <div>
            <div className="response-label flex justify-between items-center">
              <span>Chat History</span>
              <button onClick={() => setChatHistory([])} className="text-xs text-text-muted hover:text-foreground">
                Clear
              </button>
            </div>
            <div className="chat-history">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role}`}>
                  <div className={`message-role ${msg.role}`}>
                    {msg.role.toUpperCase()}
                  </div>
                  <div>{msg.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  






















































