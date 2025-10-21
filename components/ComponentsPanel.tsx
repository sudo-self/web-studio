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
  Github,
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
  currentCode?: string;
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
    <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">World Wide Web</h2>
    <p style="font-size: 1.2rem; margin-bottom: 2rem;">We create amazing digital experiences</p>
    <button style="background: white; color: #333; border: none; padding: 12px 30px; font-size: 1rem; border-radius: 5px; cursor: pointer;">Get Started</button>
  </div>
</section>`,
    description: "Hero section with call-to-action",
    tags: ["layout", "hero", "cta"]
  },
  footer: {
    code: `<!-- Footer -->
<footer style="background-color: #333; color: white; padding: 2rem; text-align: center;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <p>&copy; 2024 My Website. All rights reserved.</p>
    <div style="margin-top: 1rem;">
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Privacy Policy</a>
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Terms of Service</a>
    </div>
  </div>
</footer>`,
    description: "Website footer",
    tags: ["layout", "footer"]
  }
};

const componentCategories: ComponentCategories = {
  "Layout": ["header", "hero", "footer"],
  "Navigation": ["navbar"],
  "Content": ["card"],
  "Forms": ["contact"],
  "UI Components": ["modal"],
  "SEO": ["seo"],
  "Icons": ["social-icons"]
};

const getComponentIcon = (componentKey: string): ReactElement => {
  const icons: { [key: string]: ReactElement } = {
    header: <FileText size={16} />,
    hero: <Sparkles size={16} />,
    footer: <SquareStack size={16} />,
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

const GithubAuth = ({ onAuthSuccess }: { onAuthSuccess: (token: string) => void }) => {
  const startOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      alert('GitHub OAuth not configured - check environment variables');
      return;
    }


    const redirectUri = `https://studio.jessejesse.com/auth/github/callback`;
    
   
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('github_oauth_state', state);
    
    const scope = 'repo,workflow,user';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    
    console.log("Starting OAuth flow to:", authUrl);
    window.location.href = authUrl;
  };

  return (
    <button
      className="btn btn-primary w-full flex items-center justify-center gap-2"
      onClick={startOAuth}
    >
      <Github size={16} />
      Sign in with GitHub
    </button>
  );
};

  return (
    <button
      className="btn btn-primary w-full flex items-center justify-center gap-2"
      onClick={startOAuth}
    >
      <Github size={16} />
      Sign in with GitHub
    </button>
  );
};

export default function ComponentsPanel({
  onInsert,
  onAiInsert,
  onOpenSettings,
  onResizeStart,
  currentCode = ""
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
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubForm, setGithubForm] = useState({
    name: 'web-studio-project',
    description: 'Project created with AI Web Studio',
    isPublic: true,
    deployPages: true
  });
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState<any>(null);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get("github_token");
    const error = params.get("github_error");
    const errorDetail = params.get("error_detail");

    console.log("URL Params:", { token, error, errorDetail });

    if (error) {
      console.error("GitHub OAuth Error:", error, errorDetail);
      alert(`GitHub authentication failed: ${errorDetail || error}`);
      
      // Clean URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      return;
    }

    if (token) {
      console.log("GitHub token received");
      localStorage.setItem("github_access_token", token);
      setGithubToken(token);
      fetchUserInfo(token);
      
      // Clean URL without page reload
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

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
      
      const token = localStorage.getItem('github_access_token');
      if (token) {
        setGithubToken(token);
        fetchUserInfo(token);
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

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (response.ok) {
        const user = await response.json();
        setGithubUser(user);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

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

  const getCurrentProjectData = () => {
    const htmlContent = currentCode || `<!DOCTYPE html>
<html>
<head>
    <title>${githubForm.name}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1 {
            color: #2c5aa0;
            margin-bottom: 1rem;
        }
        .badge {
            display: inline-block;
            background: #2c5aa0;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${githubForm.name}</h1>
        <p>${githubForm.description}</p>
        <div class="badge">Made with AI Web Studio</div>
        <p>This project was created using <a href="https://studio.jessejesse.com" target="_blank">studio.jessejesse.com</a></p>
    </div>
</body>
</html>`;

    return {
      html: htmlContent
    };
  };

  const createProjectFiles = (projectData: any, deployPages: boolean) => {
    const badge = '<img src="https://img.shields.io/badge/made%20with-studio.jessejesse.com-blue?style=flat" alt="made with studio.jessejesse.com" />';
    
    const readmeContent = [
      `# ${githubForm.name}`,
      ``,
      `${githubForm.description}`,
      ``,
      `${badge}`,
      ``,
      `## About`,
      ``,
      `This project was created with [studio.jessejesse.com](https://studio.jessejesse.com) - an AI-powered web development studio.`,
      ``,
      `## Getting Started`,
      ``,
      `Open index.html in your browser to view the project.`,
      ``,
      `---`,
      `*Created with AI Web Studio*`
    ].join('\n');

    const files = [
      {
        path: 'index.html',
        content: projectData.html
      },
      {
        path: 'README.md',
        content: readmeContent
      }
    ];

    if (deployPages) {
      files.push({
        path: '.github/workflows/static.yml',
        content: `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2`
      });
    }

    return files;
  };

  const handleCreateRepo = async () => {
    if (!githubToken) {
      alert('Please connect to GitHub first');
      return;
    }

    setIsCreatingRepo(true);
    try {
      const projectData = getCurrentProjectData();
      const files = createProjectFiles(projectData, githubForm.deployPages);
      
      const response = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: githubForm.name,
          description: githubForm.description,
          isPublic: githubForm.isPublic,
          deployPages: githubForm.deployPages,
          files: files,
          accessToken: githubToken
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Repository created successfully!\n\nURL: ${result.html_url}\n${result.pages_url ? `Pages: ${result.pages_url}` : ''}`);
        setShowGithubModal(false);
        
        if (result.html_url) {
          window.open(result.html_url, '_blank');
        }
      } else {
        throw new Error(result.error || 'Failed to create repository');
      }
    } catch (error: any) {
      console.error('GitHub repo creation failed:', error);
      alert(`Failed to create repository: ${error.message}`);
    } finally {
      setIsCreatingRepo(false);
    }
  };

  const askAi = async () => {
    if (!prompt.trim()) {
      setResponse("Please enter a prompt");
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
      console.log("Sending AI request:", { 
        prompt: prompt.substring(0, 100), 
        mode, 
        timestamp: new Date().toISOString()
      });
      
      const messages = [
        {
          role: "user" as const,
          content: `You are an expert web developer. Create responsive HTML with inline CSS for: "${prompt}"

CRITICAL REQUIREMENTS:
- Return ONLY the HTML code with inline styles
- No explanations, no markdown formatting, no backticks
- Make it modern, responsive, and production-ready
- Use semantic HTML where possible
- Include proper hover/focus states
- Ensure good color contrast
- Make it work on all screen sizes`
        }
      ];

      const response = await fetch('https://llm.jessejesse.workers.dev/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      console.log("Worker response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Worker API error: ${response.status} - ${errorText}`);
      }

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
                  setResponse(fullContent);
                }
              } catch (e) {
                // Ignore JSON parse errors for non-data lines
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

      const cleaned = fullContent
        .replace(/```(html|css|js)?/gi, '')
        .replace(/```/g, '')
        .replace(/^`|`$/g, '')
        .trim();

      setResponse(cleaned);

      const timestamp = new Date().toLocaleTimeString();
      onAiInsert(`\n<!-- AI Generated (${timestamp}): ${prompt.substring(0, 50)}... -->\n${cleaned}\n`);

      if (mode === "chat") {
        setChatHistory(prev => [
          ...prev,
          { role: "user", content: prompt },
          { role: "assistant", content: cleaned }
        ]);
      }
      
      setPrompt("");

    } catch (err) {
      console.error("AI request failed:", err);
      let userMessage = "An error occurred";
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          userMessage = "Network error. Check your connection and API endpoint.";
        } else if (err.message.includes('403')) {
          userMessage = "Access denied. Check your worker configuration.";
        } else if (err.message.includes('429')) {
          userMessage = "Rate limit exceeded. Wait a moment before trying again.";
        } else if (err.message.includes('404')) {
          userMessage = "API endpoint not found. Check your worker URL.";
        } else {
          userMessage = err.message;
        }
      }
      
      setResponse(`Error: ${userMessage}`);
      
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
          <div className="flex items-center gap-1 text-xs text-green-400 font-medium text-text-secondary">
            <SquareStack size={12} />
            <span>studio.JesseJesse.com</span>
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
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="ai-section">
        <div className="panel-header">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Bot size={18} style={{ color: "var(--accent-color)" }} />
              <h3>AI</h3>
            </div>
            <button 
              className="btn btn-outline btn-sm flex items-center gap-2"
              onClick={() => setShowGithubModal(true)}
            >
              <Github size={14} />
              Create Repo
            </button>
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
            No Memory
          </label>
          <label className="mode-option">
            <input
              type="radio"
              value="chat"
              checked={mode === "chat"}
              onChange={() => setMode("chat")}
              disabled={loading || isRequesting}
            />
            Chat Mode
          </label>
        </div>

        <div className="relative">
          <textarea
            className="prompt-textarea"
            placeholder="describe what to create..."
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
            <span>Cloudflare Workers AI</span>
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

      {showGithubModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Github size={20} />
                Create GitHub Repository
              </h3>
              <button 
                onClick={() => setShowGithubModal(false)}
                className="btn btn-ghost btn-sm btn-icon"
                disabled={isCreatingRepo}
              >
                <X size={16} />
              </button>
            </div>
            
            {!githubToken ? (
              <div className="text-center py-4">
                <Github size={48} className="mx-auto mb-4 text-text-muted" />
                <h4 className="text-lg font-medium mb-2 text-text-primary">Connect GitHub</h4>
                <p className="text-text-muted mb-6">Sign in with GitHub to create repositories and deploy to Pages</p>
                <GithubAuth onAuthSuccess={(token) => {
                  setGithubToken(token);
                  localStorage.setItem('github_access_token', token);
                  fetchUserInfo(token);
                }} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-3 bg-component-bg rounded border border-panel-border">
                  <div className="flex items-center gap-3">
                    <img 
                      src={githubUser?.avatar_url} 
                      alt="GitHub Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-text-primary">{githubUser?.login}</div>
                      <div className="text-xs text-text-muted">Connected to GitHub</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('github_access_token');
                      setGithubToken(null);
                      setGithubUser(null);
                    }}
                    className="text-xs text-accent-color hover:underline"
                    disabled={isCreatingRepo}
                  >
                    Disconnect
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Repository Name
                    </label>
                    <input 
                      type="text" 
                      value={githubForm.name}
                      onChange={(e) => setGithubForm(prev => ({...prev, name: e.target.value}))}
                      className="w-full p-3 border border-panel-border rounded-lg bg-component-bg text-text-primary text-sm focus:outline-none focus:border-accent-color"
                      placeholder="my-awesome-project"
                      disabled={isCreatingRepo}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Description
                    </label>
                    <input 
                      type="text" 
                      value={githubForm.description}
                      onChange={(e) => setGithubForm(prev => ({...prev, description: e.target.value}))}
                      className="w-full p-3 border border-panel-border rounded-lg bg-component-bg text-text-primary text-sm focus:outline-none focus:border-accent-color"
                      placeholder="Project created with AI Web Studio"
                      disabled={isCreatingRepo}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="deploy-pages" 
                      checked={githubForm.deployPages}
                      onChange={(e) => setGithubForm(prev => ({...prev, deployPages: e.target.checked}))}
                      className="rounded border-panel-border bg-component-bg focus:ring-accent-color"
                      disabled={isCreatingRepo}
                    />
                    <label htmlFor="deploy-pages" className="text-sm text-text-primary">
                      Deploy to GitHub Pages
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="is-public" 
                      checked={githubForm.isPublic}
                      onChange={(e) => setGithubForm(prev => ({...prev, isPublic: e.target.checked}))}
                      className="rounded border-panel-border bg-component-bg focus:ring-accent-color"
                      disabled={isCreatingRepo}
                    />
                    <label htmlFor="is-public" className="text-sm text-text-primary">
                      Public repository
                    </label>
                  </div>

                  <div className="text-xs text-text-muted bg-component-bg p-4 rounded-lg border border-panel-border">
                    <p className="font-medium text-text-primary mb-3">Files that will be created:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-text-muted rounded-full"></div>
                        <code className="text-text-primary">index.html</code>
                        <span className="text-text-muted">- Your website</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-text-muted rounded-full"></div>
                        <code className="text-text-primary">README.md</code>
                        <span className="text-text-muted">- Project info</span>
                      </li>
                      {githubForm.deployPages && (
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-text-muted rounded-full"></div>
                          <code className="text-text-primary">.github/workflows/static.yml</code>
                          <span className="text-text-muted">- Deploy Pages</span>
                        </li>
                      )}
                    </ul>
                    {githubForm.deployPages && (
                      <p className="mt-3 text-text-primary text-sm">
                        Your site will be available at: <br />
                        <code className="text-accent-color">https://{githubUser?.login}.github.io/{githubForm.name}</code>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    className="btn btn-ghost flex-1"
                    onClick={() => setShowGithubModal(false)}
                    disabled={isCreatingRepo}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    onClick={handleCreateRepo}
                    disabled={isCreatingRepo || !githubForm.name.trim()}
                  >
                    {isCreatingRepo ? (
                      <>
                        <div className="loading-spinner"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Github size={16} />
                        Create Repository
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
