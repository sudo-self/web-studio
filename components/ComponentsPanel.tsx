"use client";

import { useState, useMemo, useEffect } from "react";
import { ReactElement } from "react";
import BuildPrompts from "./BuildPrompts";
import { GitHubModal } from "./GitHubModal";
import {
  FileText, Sparkles, Info, Wrench, Phone, SquareStack, CreditCard,
  Image, Search, Tag, Users, Stars, Type, Bot, Settings, Navigation,
  Sidebar, BarChart3, Mail, HelpCircle, TrendingUp, Clock, Github
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
  framework: string;
}

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface GitHubFormData {
  name: string;
  description: string;
  isPublic: boolean;
  deployPages: boolean;
}


const COMPONENT_ICONS: { [key: string]: ReactElement } = {
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
  navbar: <Navigation size={16} />,
  sidebar: <Sidebar size={16} />,
  pricing: <CreditCard size={16} />,
  testimonials: <Users size={16} />,
  stats: <BarChart3 size={16} />,
  "login-form": <Mail size={16} />,
  newsletter: <Mail size={16} />,
  team: <Users size={16} />,
  faq: <HelpCircle size={16} />,
  breadcrumb: <Navigation size={16} />,
  modal: <SquareStack size={16} />,
  progress: <TrendingUp size={16} />,
  timeline: <Clock size={16} />,
  "primary-button": <SquareStack size={16} />,
  "secondary-button": <SquareStack size={16} />,
  "button-group": <SquareStack size={16} />,
  "readme-basic": <FileText size={16} />,
  "readme-advanced": <FileText size={16} />,
  "search-bar": <Search size={16} />,
  "toggle-switch": <Settings size={16} />,
  "mega-menu": <Navigation size={16} />,
  "breadcrumb-advanced": <Navigation size={16} />,
};


const useLocalStorageState = <T,>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Failed to load ${key} from localStorage:`, e);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage:`, e);
    }
  }, [key, state]);

  return [state, setState] as const;
};

const useGitHubAuth = () => {
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get("github_token");
    const error = params.get("github_error");
    const errorDetail = params.get("error_detail");

    if (error) {
      console.error("GitHub OAuth Error:", error, errorDetail);
      alert(`GitHub authentication failed: ${errorDetail || error}`);
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      return;
    }

    if (token) {
      localStorage.setItem("github_access_token", token);
      setGithubToken(token);
      fetchUserInfo(token);
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

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

  return { githubToken, setGithubToken, githubUser, setGithubUser, fetchUserInfo };
};

// Utility Functions
const getComponentIcon = (componentKey: string): ReactElement => {
  return COMPONENT_ICONS[componentKey] || <FileText size={16} />;
};

const formatComponentName = (key: string): string => {
  return key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
};

const createProjectFiles = (
  projectData: any,
  deployPages: boolean,
  githubUser: any,
  githubForm: GitHubFormData
) => {
  const badge = '<img src="https://img.shields.io/badge/made%20with-studio.jessejesse.com-blue?style=flat" alt="made with studio.jessejesse.com" />';

  const pagesSection = deployPages
    ? `## GitHub Pages Deployment\n\nYour site will be automatically deployed to GitHub Pages at:\n\nhttps://${githubUser?.login}.github.io/${githubForm.name}/\n\nThe deployment will start automatically when you push to the main branch.`
    : `## Deployment\n\nTo deploy this site to GitHub Pages:\n1. Go to Settings → Pages\n2. Select "Deploy from a branch"\n3. Choose "main" branch and "/" root folder\n4. Click Save`;

  const readmeContent = [
    `# ${githubForm.name}`,
    ``,
    `${githubForm.description}`,
    ``,
    `${badge}`,
    ``,
    `## About`,
    ``,
    `[studio.jessejesse.com](https://studio.jessejesse.com)`,
    ``,
    `## Getting Started`,
    ``,
    `Open index.html in your browser to view the project.`,
    ``,
    pagesSection,
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
      path: '.github/workflows/deploy.yml',
      content: `# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`
    });
  }

  return files;
};

// Main Component
export default function ComponentsPanel({
  onInsert,
  onAiInsert,
  onOpenSettings,
  onResizeStart,
  currentCode = "",
  framework
}: ComponentsPanelProps) {
  const { settings } = useSettings();
  
  // State management
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState<AiMode>("response");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewComponent, setPreviewComponent] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  
  const [favorites, setFavorites] = useLocalStorageState<Set<string>>('component-favorites', new Set());
  const [recentComponents, setRecentComponents] = useLocalStorageState<string[]>('recent-components', []);
  const [githubForm, setGithubForm] = useState<GitHubFormData>({
    name: 'web-studio-project',
    description: 'Project created with AI Web Studio',
    isPublic: true,
    deployPages: true
  });

  const { githubToken, setGithubToken, githubUser, setGithubUser, fetchUserInfo } = useGitHubAuth();

  // Memoized computed values
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

  // Event handlers
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
        <div class="badge">AI Web Studio</div>
        <p>This project was created using <a href="https://studio.jessejesse.com" target="_blank">studio.jessejesse.com</a></p>
    </div>
</body>
</html>`;

    return { html: htmlContent };
  };

  const handleCreateRepo = async () => {
    if (!githubToken) {
      alert('Please connect to GitHub first');
      return;
    }

    setIsCreatingRepo(true);
    const newWindow = window.open('', '_blank', 'width=400,height=200');
    if (newWindow) {
      newWindow.document.write('<p style="font-family:sans-serif; padding: 20px;">Creating repository…</p>');
      newWindow.document.close();
    }

    try {
      const projectData = getCurrentProjectData();
      const files = createProjectFiles(projectData, githubForm.deployPages, githubUser, githubForm);

      const response = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        const html = `
          <div style="font-family:sans-serif; padding: 20px;">
            <p>Repository created successfully!</p>
            <p>URL: <a href="${result.html_url}" target="_blank" style="color:blue">${result.html_url}</a></p>
            ${result.pages_url ? `<p>Pages: <a href="${result.pages_url}" target="_blank" style="color:blue">${result.pages_url}</a></p>` : ''}
          </div>
        `;
        if (newWindow) {
          newWindow.document.open();
          newWindow.document.write(html);
          newWindow.document.close();
        }
        setShowGithubModal(false);
      } else {
        throw new Error(result.error || 'Failed to create repository');
      }
    } catch (error: any) {
      console.error('GitHub repo creation failed:', error);
      if (newWindow) newWindow.close();
      alert(`Failed to create repository: ${error.message}`);
    } finally {
      setIsCreatingRepo(false);
    }
  };

const askAi = async () => {
  if (!prompt.trim() || isRequesting || loading) return;
  
  setIsRequesting(true);
  setLoading(true);
  setResponse("");

  try {
    const frameworkInstructions = framework === "react"
      ? `STRICT INSTRUCTIONS: Create React component for "${prompt}". RETURN ONLY CODE. NO EXPLANATIONS. NO MARKDOWN. NO IMPORTS. Use React.useState not imports. Include rendering code.`
      : `STRICT INSTRUCTIONS: Create HTML for "${prompt}". RETURN ONLY CODE. NO EXPLANATIONS. NO MARKDOWN.`;

    const messages = [{ role: "user" as const, content: frameworkInstructions }];
    const response = await fetch('https://llm.jessejesse.workers.dev/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Worker API error: ${response.status} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body received");

    let fullContent = '';
    const decoder = new TextDecoder();

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

    reader.releaseLock();

    if (!fullContent.trim()) {
      throw new Error("Worker returned empty response");
    }

    // Extract only the code using multiple strategies
    let cleaned = fullContent;
    
    // Strategy 1: Remove all markdown and explanations
    cleaned = cleaned
      .replace(/```(html|css|js|jsx|javascript)?/gi, '')
      .replace(/```/g, '')
      .replace(/^`|`$/g, '')
      .replace(/#{1,6}\s?.*$/gm, '') // Remove all markdown headers
      .replace(/^###.*$/gm, '')
      .replace(/^####.*$/gm, '')
      .replace(/^Overview.*$/gm, '')
      .replace(/^Explanation.*$/gm, '')
      .replace(/^Code.*$/gm, '')
      .replace(/^Usage.*$/gm, '')
      .replace(/^This component.*$/gm, '')
      .replace(/^We define.*$/gm, '')
      .replace(/^We use.*$/gm, '')
      .replace(/^We render.*$/gm, '')
      .replace(/^As a loyal.*$/gm, '')
      .replace(/^Go Broncos!.*$/gm, '')
      .replace(/^STRICT INSTRUCTIONS:.*$/gm, '')
      .replace(/^Finally.*$/gm, '')
      .replace(/^The component.*$/gm, '')
      .replace(/^This creates.*$/gm, '')
      .replace(/^It uses.*$/gm, '')
      .replace(/^The component is.*$/gm, '')
      .replace(/^### Explanation[\s\S]*?### Usage/g, '') // Remove explanation sections
      .replace(/import React.*?;?\n?/g, '')
      .replace(/import.*?from.*?;?\n?/g, '')
      .replace(/export default.*?;?\n?/g, '')
      .replace(/export.*?;?\n?/g, '');

    // Strategy 2: If we still have non-code content, try to extract just the function
    if (cleaned.includes('function') || cleaned.includes('const') || cleaned.includes('return')) {
      // Try to find the actual component code
      const functionMatch = cleaned.match(/(function\s+\w+|const\s+\w+\s*=)/);
      if (functionMatch) {
        const startIndex = cleaned.indexOf(functionMatch[0]);
        // Find the end of the component (last closing brace before rendering)
        const lastBraceIndex = cleaned.lastIndexOf('}');
        const renderIndex = cleaned.indexOf('ReactDOM.createRoot');
        
        if (startIndex !== -1 && lastBraceIndex !== -1 && renderIndex !== -1) {
          cleaned = cleaned.substring(startIndex, renderIndex + cleaned.substring(renderIndex).indexOf(');') + 2);
        }
      }
    }

    // Strategy 3: Fix React.useState if needed
    cleaned = cleaned.replace(/useState\(/g, 'React.useState(');
    cleaned = cleaned.replace(/useEffect\(/g, 'React.useEffect(');

    // Strategy 4: Remove any remaining non-code lines
    const lines = cleaned.split('\n').filter(line => {
      const trimmed = line.trim();
      return (
        trimmed.length > 0 &&
        !trimmed.startsWith('//') &&
        !trimmed.startsWith('/*') &&
        !trimmed.startsWith('*') &&
        !trimmed.endsWith('*/') &&
        !trimmed.match(/^[#\*\-]/) && // No markdown bullets
        !trimmed.match(/^[A-Z][a-z]/) && // No sentence starts
        (trimmed.includes('function') || 
         trimmed.includes('const') || 
         trimmed.includes('return') || 
         trimmed.includes('<') || 
         trimmed.includes('>') || 
         trimmed.includes('{') || 
         trimmed.includes('}') ||
         trimmed.includes('React.') ||
         trimmed.includes('style=') ||
         trimmed.includes('onClick='))
      );
    });

    cleaned = lines.join('\n').trim();

    // If we still don't have valid code, create a fallback
    if (!cleaned || (!cleaned.includes('function') && !cleaned.includes('const') && !cleaned.includes('return'))) {
      throw new Error("AI returned invalid code format");
    }

    setResponse(cleaned);

    const timestamp = new Date().toLocaleTimeString();
    const frameworkLabel = framework === "react" ? "React" : "HTML";
    
    onAiInsert(`\n<!-- AI Generated ${frameworkLabel} (${timestamp}): ${prompt.substring(0, 50)}... -->\n${cleaned}\n`);

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
      } else if (err.message.includes('invalid code format')) {
        userMessage = "AI returned invalid code format. Please try a different prompt.";
      } else {
        userMessage = err.message;
      }
    }
    
    setResponse(`Error: ${userMessage}`);
  } finally {
    setLoading(false);
    setTimeout(() => setIsRequesting(false), 1000);
  }
};

  // Render methods
  const renderHeader = () => (
    <div className="!p-2 border-b border-panel-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="m-0 text-xs font-semibold">studio.JesseJesse.com</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchTerm(searchTerm ? '' : ' ')}
            className="!p-1.5 hover:bg-component-hover rounded transition-colors"
            title="Search"
          >
            <Search size={15} />
          </button>
          <button
            onClick={onOpenSettings}
            className="!p-1.5 hover:bg-component-hover rounded transition-colors"
            title="Settings"
          >
            <Settings size={15} />
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
  );

  const renderComponentsList = () => (
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
                  {formatComponentName(key)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAISection = () => (
    <div className="ai-section">
      <div className="panel-header">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <BuildPrompts onPromptSelect={setPrompt} />
            <button
              className="btn btn-outline btn-sm flex items-center gap-2"
              onClick={() => setShowGithubModal(true)}
            >
              <Github size={14} />
              Create Repo
            </button>
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
          <span>@cf/meta/llama-3.3-70b-instruct-fp8-fast</span>
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
  );

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {onResizeStart && (
        <div
          className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-accent-color hover:bg-opacity-50 transition-colors"
          onMouseDown={onResizeStart}
        />
      )}

      {renderHeader()}
      {renderComponentsList()}
      {renderAISection()}

      <GitHubModal
        showGithubModal={showGithubModal}
        setShowGithubModal={setShowGithubModal}
        githubToken={githubToken}
        setGithubToken={setGithubToken}
        githubUser={githubUser}
        setGithubUser={setGithubUser}
        githubForm={githubForm}
        setGithubForm={setGithubForm}
        isCreatingRepo={isCreatingRepo}
        handleCreateRepo={handleCreateRepo}
        fetchUserInfo={fetchUserInfo}
      />
    </div>
  );
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
      about: {
        code: `<!-- About Section -->
    <section style="padding: 4rem 2rem; background-color: #f9f9f9;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">About Us</h2>
        <p style="line-height: 1.6; margin-bottom: 1rem; color: #666;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p style="line-height: 1.6; color: #666;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
      </div>
    </section>`,
        description: "About section with company information",
        tags: ["layout", "content", "about"]
      },
      services: {
        code: `<!-- Services Section -->
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
        description: "Services showcase section",
        tags: ["layout", "content", "services"]
      },
      contact: {
        code: `<!-- Contact Form -->
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
        description: "Contact form section",
        tags: ["forms", "contact"]
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
      },
      card: {
        code: `<!-- Card Component -->
    <div style="background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 300px; margin: 0 auto;">
      <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Card Image" style="width: 100%; height: auto;">
      <div style="padding: 1.5rem;">
        <h3 style="margin-bottom: 0.5rem; color: #333;">Card Title</h3>
        <p style="color: #666; margin-bottom: 1rem;">This is a sample card with example content.</p>
        <button style="background: #333; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Learn More</button>
      </div>
    </div>`,
        description: "Card component with image and text",
        tags: ["ui", "card", "content"]
      },
      gallery: {
        code: `<!-- Image Gallery -->
    <section style="padding: 2rem; background-color: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Image Gallery</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
          <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Gallery Image" style="width: 100%; height: auto; border-radius: 8px;">
          <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Gallery Image" style="width: 100%; height: auto; border-radius: 8px;">
        </div>
      </div>
    </section>`,
        description: "Image gallery grid",
        tags: ["content", "gallery", "images"]
      },
      seo: {
        code: `<!-- SEO Meta Tags -->
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
        description: "SEO meta tags for head section",
        tags: ["seo", "meta", "head"]
      },
      "seo-schema": {
        code: `<!-- Schema.org Structured Data -->
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
        description: "Schema.org structured data",
        tags: ["seo", "schema", "structured-data"]
      },
      "social-icons": {
        code: `<!-- Social Media Icons with Font Awesome -->
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
        description: "Social media icons",
        tags: ["icons", "social", "ui"]
      },
      "feature-icons": {
        code: `<!-- Feature Icons Section -->
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
        description: "Feature showcase with icons",
        tags: ["content", "features", "icons"]
      },
      "font-icons": {
        code: `<!-- Font Awesome Icons (CDN) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <div style="display: flex; gap: 20px; justify-content: center; padding: 2rem;">
      <i class="fas fa-home" style="font-size: 24px; color: #333;"></i>
      <i class="fas fa-envelope" style="font-size: 24px; color: #333;"></i>
      <i class="fas fa-phone" style="font-size: 24px; color: #333;"></i>
      <i class="fas fa-share-alt" style="font-size: 24px; color: #333;"></i>
    </div>`,
        description: "Font Awesome icons",
        tags: ["icons", "ui"]
      },
      navbar: {
        code: `<!-- Modern Navigation Bar -->
    <nav style="background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 1rem 2rem;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 1.5rem; font-weight: bold; color: #333;">Logo</div>
        <div style="display: flex; gap: 2rem;">
          <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">Home</a>
          <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">About</a>
          <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">Services</a>
          <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">Contact</a>
        </div>
        <button style="background: #667eea; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer;">Get Started</button>
      </div>
    </nav>`,
        description: "Modern navigation bar",
        tags: ["navigation", "header", "ui"]
      },
      sidebar: {
        code: `<!-- Sidebar Navigation -->
    <div style="display: flex; min-height: 400px;">
      <aside style="width: 250px; background: #2d3748; color: white; padding: 2rem;">
        <h3 style="margin-bottom: 2rem;">Menu</h3>
        <nav style="display: flex; flex-direction: column; gap: 1rem;">
          <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px; background: #4a5568;">Dashboard</a>
          <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">Profile</a>
          <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">Settings</a>
          <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">Messages</a>
        </nav>
      </aside>
      <main style="flex: 1; padding: 2rem; background: #f7fafc;">
        <h2>Main Content Area</h2>
        <p>Your content goes here...</p>
      </main>
    </div>`,
        description: "Sidebar navigation layout",
        tags: ["layout", "navigation", "sidebar"]
      },
      pricing: {
        code: `<!-- Pricing Cards -->
    <section style="padding: 4rem 2rem; background: #f8fafc;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Choose Your Plan</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: #333;">Basic</h3>
            <div style="font-size: 2rem; font-weight: bold; color: #667eea; margin: 1rem 0;">$19<span style="font-size: 1rem; color: #666;">/month</span></div>
            <ul style="list-style: none; padding: 0; margin: 2rem 0;">
              <li style="padding: 0.5rem 0;">5 Projects</li>
              <li style="padding: 0.5rem 0;">10GB Storage</li>
              <li style="padding: 0.5rem 0;">Basic Support</li>
            </ul>
            <button style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; width: 100%;">Get Started</button>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 8px 15px rgba(0,0,0,0.1); text-align: center; border: 2px solid #667eea;">
            <div style="background: #667eea; color: white; padding: 0.5rem; border-radius: 5px; margin: -2rem -2rem 1rem -2rem;">Most Popular</div>
            <h3 style="color: #333;">Pro</h3>
            <div style="font-size: 2rem; font-weight: bold; color: #667eea; margin: 1rem 0;">$49<span style="font-size: 1rem; color: #666;">/month</span></div>
            <ul style="list-style: none; padding: 0; margin: 2rem 0;">
              <li style="padding: 0.5rem 0;">Unlimited Projects</li>
              <li style="padding: 0.5rem 0;">50GB Storage</li>
              <li style="padding: 0.5rem 0;">Priority Support</li>
            </ul>
            <button style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; width: 100%;">Get Started</button>
          </div>
        </div>
      </div>
    </section>`,
        description: "Pricing cards section",
        tags: ["ui", "pricing", "cards"]
      },
      testimonials: {
        code: `<!-- Testimonials Section -->
    <section style="padding: 4rem 2rem; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">What Our Clients Say</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div style="background: #f8fafc; padding: 2rem; border-radius: 10px; border-left: 4px solid #667eea;">
            <div style="color: #667eea; font-size: 1.5rem; margin-bottom: 1rem;">"</div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">This service has completely transformed our business. The results were beyond our expectations!</p>
            <div style="font-weight: bold; color: #333;">- Sarah Johnson</div>
            <div style="color: #666; font-size: 0.9rem;">CEO, Tech Solutions</div>
          </div>
          <div style="background: #f8fafc; padding: 2rem; border-radius: 10px; border-left: 4px solid #667eea;">
            <div style="color: #667eea; font-size: 1.5rem; margin-bottom: 1rem;">"</div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">Outstanding quality and professional service. Highly recommended for any business.</p>
            <div style="font-weight: bold; color: #333;">- Michael Chen</div>
            <div style="color: #666; font-size: 0.9rem;">Marketing Director</div>
          </div>
        </div>
      </div>
    </section>`,
        description: "Customer testimonials section",
        tags: ["content", "testimonials", "social-proof"]
      },
      stats: {
        code: `<!-- Statistics Section -->
    <section style="padding: 4rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center;">
          <div>
            <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">500+</div>
            <div style="font-size: 1.1rem;">Happy Clients</div>
          </div>
          <div>
            <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">99%</div>
            <div style="font-size: 1.1rem;">Satisfaction Rate</div>
          </div>
          <div>
            <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">24/7</div>
            <div style="font-size: 1.1rem;">Support</div>
          </div>
          <div>
            <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">5+</div>
            <div style="font-size: 1.1rem;">Years Experience</div>
          </div>
        </div>
      </div>
    </section>`,
        description: "Statistics counter section",
        tags: ["content", "stats", "numbers"]
      },
      "login-form": {
        code: `<!-- Login Form -->
    <div style="max-width: 400px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Welcome Back</h2>
      <form>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Email</label>
          <input type="email" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;" placeholder="Enter your email">
        </div>
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Password</label>
          <input type="password" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;" placeholder="Enter your password">
        </div>
        <button type="submit" style="width: 100%; background: #667eea; color: white; border: none; padding: 12px; border-radius: 5px; font-size: 1rem; cursor: pointer;">Sign In</button>
      </form>
      <div style="text-align: center; margin-top: 1rem;">
        <a href="#" style="color: #667eea; text-decoration: none;">Forgot password?</a>
      </div>
    </div>`,
        description: "Login form component",
        tags: ["forms", "login", "authentication"]
      },
      newsletter: {
        code: `<!-- Newsletter Signup -->
    <section style="padding: 4rem 2rem; background: #667eea; color: white;">
      <div style="max-width: 600px; margin: 0 auto; text-align: center;">
        <h2 style="margin-bottom: 1rem;">Stay Updated</h2>
        <p style="margin-bottom: 2rem; opacity: 0.9;">Subscribe to our newsletter for the latest updates and offers.</p>
        <form style="display: flex; gap: 1rem; max-width: 400px; margin: 0 auto;">
          <input type="email" placeholder="Enter your email" style="flex: 1; padding: 12px; border: none; border-radius: 5px; font-size: 1rem;">
          <button type="submit" style="background: white; color: #667eea; border: none; padding: 12px 24px; border-radius: 5px; font-size: 1rem; cursor: pointer; font-weight: bold;">Subscribe</button>
        </form>
      </div>
    </section>`,
        description: "Newsletter signup form",
        tags: ["forms", "newsletter", "marketing"]
      },
      team: {
        code: `<!-- Team Section -->
    <section style="padding: 4rem 2rem; background: #f8fafc;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Meet Our Team</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
          <div style="text-align: center; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Team Member" style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 1rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">John Doe</h3>
            <div style="color: #667eea; margin-bottom: 1rem;">CEO & Founder</div>
            <p style="color: #666;">Visionary leader with 10+ years of experience in the industry.</p>
          </div>
          <div style="text-align: center; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Team Member" style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 1rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">Jane Smith</h3>
            <div style="color: #667eea; margin-bottom: 1rem;">Creative Director</div>
            <p style="color: #666;">Award-winning designer with a passion for innovation.</p>
          </div>
        </div>
      </div>
    </section>`,
        description: "Team member showcase",
        tags: ["content", "team", "about"]
      },
      faq: {
        code: `<!-- FAQ Section -->
    <section style="padding: 4rem 2rem; background: white;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Frequently Asked Questions</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">What is your refund policy?</h3>
            <p style="color: #666; margin: 0;">We offer a 30-day money-back guarantee for all our plans. If you're not satisfied, we'll refund your payment.</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">Do you offer technical support?</h3>
            <p style="color: #666; margin: 0;">Yes, we provide 24/7 technical support for all our customers via email, chat, and phone.</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">Can I upgrade my plan later?</h3>
            <p style="color: #666; margin: 0;">Absolutely! You can upgrade or downgrade your plan at any time from your account dashboard.</p>
          </div>
        </div>
      </div>
    </section>`,
        description: "FAQ accordion section",
        tags: ["content", "faq", "help"]
      },
      breadcrumb: {
        code: `<!-- Breadcrumb Navigation -->
    <nav style="padding: 1rem 2rem; background: #f7fafc;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; gap: 0.5rem; font-size: 0.9rem;">
          <a href="#" style="color: #667eea; text-decoration: none;">Home</a>
          <span style="color: #a0aec0;">/</span>
          <a href="#" style="color: #667eea; text-decoration: none;">Category</a>
          <span style="color: #a0aec0;">/</span>
          <span style="color: #718096;">Current Page</span>
        </div>
      </div>
    </nav>`,
        description: "Breadcrumb navigation",
        tags: ["navigation", "breadcrumb", "ui"]
      },
      modal: {
        code: `<!-- Modal Dialog -->
    <div style="background: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <h2 style="margin-bottom: 1rem; color: #333;">Modal Title</h2>
        <p style="color: #666; margin-bottom: 2rem;">This is a sample modal dialog. You can put any content here.</p>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button style="background: #e2e8f0; color: #4a5568; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cancel</button>
          <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Confirm</button>
        </div>
      </div>
    </div>`,
        description: "Modal dialog component",
        tags: ["ui", "modal", "dialog"]
      },
      progress: {
        code: `<!-- Progress Bars -->
    <div style="max-width: 600px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin-bottom: 2rem; color: #333;">Skills & Progress</h3>
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: between; margin-bottom: 0.5rem;">
          <span style="color: #333;">Web Design</span>
          <span style="color: #667eea;">90%</span>
        </div>
        <div style="background: #e2e8f0; border-radius: 10px; height: 8px;">
          <div style="background: #667eea; height: 100%; width: 90%; border-radius: 10px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: between; margin-bottom: 0.5rem;">
          <span style="color: #333;">Development</span>
          <span style="color: #667eea;">75%</span>
        </div>
        <div style="background: #e2e8f0; border-radius: 10px; height: 8px;">
          <div style="background: #667eea; height: 100%; width: 75%; border-radius: 10px;"></div>
        </div>
      </div>
    </div>`,
        description: "Progress bar component",
        tags: ["ui", "progress", "skills"]
      },
      timeline: {
        code: `<!-- Timeline -->
    <div style="max-width: 800px; margin: 2rem auto; padding: 2rem;">
      <h3 style="margin-bottom: 2rem; color: #333; text-align: center;">Our Journey</h3>
      <div style="position: relative;">
        <div style="display: flex; margin-bottom: 2rem;">
          <div style="flex: 0 0 100px; text-align: right; padding-right: 2rem;">
            <div style="font-weight: bold; color: #667eea;">2020</div>
          </div>
          <div style="flex: 1; padding-left: 2rem; border-left: 2px solid #667eea; position: relative;">
            <div style="width: 12px; height: 12px; background: #667eea; border-radius: 50%; position: absolute; left: -7px; top: 5px;"></div>
            <h4 style="color: #333; margin-bottom: 0.5rem;">Company Founded</h4>
            <p style="color: #666; margin: 0;">Started our journey with a small team and big dreams.</p>
          </div>
        </div>
        <div style="display: flex; margin-bottom: 2rem;">
          <div style="flex: 0 0 100px; text-align: right; padding-right: 2rem;">
            <div style="font-weight: bold; color: #667eea;">2022</div>
          </div>
          <div style="flex: 1; padding-left: 2rem; border-left: 2px solid #667eea; position: relative;">
            <div style="width: 12px; height: 12px; background: #667eea; border-radius: 50%; position: absolute; left: -7px; top: 5px;"></div>
            <h4 style="color: #333; margin-bottom: 0.5rem;">Series A Funding</h4>
            <p style="color: #666; margin: 0;">Raised $5M to expand our services and team.</p>
          </div>
        </div>
      </div>
    </div>`,
        description: "Timeline component",
        tags: ["content", "timeline", "history"]
      },

      "primary-button": {
        code: `<!-- Primary Button -->
    <button style="background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">
      Primary Button
    </button>`,
        description: "Primary action button",
        tags: ["ui", "button", "interactive"]
      },
      "secondary-button": {
        code: `<!-- Secondary Button -->
    <button style="background: transparent; color: #667eea; border: 2px solid #667eea; padding: 10px 22px; border-radius: 6px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">
      Secondary Button
    </button>`,
        description: "Secondary action button",
        tags: ["ui", "button", "interactive"]
      },
      "button-group": {
        code: `<!-- Button Group -->
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Primary</button>
      <button style="background: transparent; color: #667eea; border: 2px solid #667eea; padding: 8px 18px; border-radius: 6px; cursor: pointer;">Secondary</button>
      <button style="background: #e2e8f0; color: #4a5568; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Default</button>
    </div>`,
        description: "Group of buttons",
        tags: ["ui", "button", "group"]
      },

      "readme-basic": {
        code: `<!-- Basic README Template -->
    <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <h1 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 0.5rem;">Project Name</h1>
      
      <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
        <p style="margin: 0; color: #4a5568;">A brief description of your project.</p>
      </div>

      <h2 style="color: #333; margin-top: 2rem;">Features</h2>
      <ul style="color: #4a5568;">
        <li>Feature 1</li>
        <li>Feature 2</li>
        <li>Feature 3</li>
      </ul>

      <h2 style="color: #333; margin-top: 2rem;">Installation</h2>
      <pre style="background: #2d3748; color: #e2e8f0; padding: 1rem; border-radius: 6px;">
    npm install</pre>

      <h2 style="color: #333; margin-top: 2rem;">Usage</h2>
      <pre style="background: #2d3748; color: #e2e8f0; padding: 1rem; border-radius: 6px;">
    npm start</pre>
    </div>`,
        description: "Basic README template",
        tags: ["documentation", "readme", "markdown"]
      },
      
      "readme-advanced": {
        code: `<!-- Advanced README Template -->
    <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h1 style="color: #333; margin-bottom: 0.5rem;">Project Name</h1>
        <p style="color: #666; font-size: 1.2rem;">A modern web application</p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
          <span style="background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">JavaScript</span>
          <span style="background: #48bb78; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">HTML5</span>
          <span style="background: #ed8936; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">CSS3</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0;">
        <div style="text-align: center;">
          <h3 style="color: #333;">Fast</h3>
          <p style="color: #666;">Lightning fast performance</p>
        </div>
        <div style="text-align: center;">
          <h3 style="color: #333;">Responsive</h3>
          <p style="color: #666;">Works on all devices</p>
        </div>
        <div style="text-align: center;">
          <h3 style="color: #333;">Modern</h3>
          <p style="color: #666;">Clean, modern design</p>
        </div>
      </div>

      <h2 style="color: #333; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">Quick Start</h2>
      <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
        <div style="background: #edf2f7; padding: 0.5rem 1rem; font-weight: 500; color: #4a5568;">Terminal</div>
        <pre style="margin: 0; padding: 1rem; background: #2d3748; color: #e2e8f0;">
    git clone https://github.com/user/repo.git
    cd project
    npm install
    npm run dev</pre>
      </div>
    </div>`,
        description: "Advanced README with badges",
        tags: ["documentation", "readme", "badges"]
      },
      
      "search-bar": {
        code: `<!-- Search Bar -->
    <div style="max-width: 400px; margin: 2rem auto;">
      <div style="position: relative;">
        <input type="text" placeholder="Search..." style="width: 100%; padding: 12px 45px 12px 16px; border: 2px solid #e2e8f0; border-radius: 25px; font-size: 1rem; transition: border-color 0.2s ease;">
        <button style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: #667eea; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </button>
      </div>
    </div>`,
        description: "Search input with button",
        tags: ["forms", "search", "input"]
      },
      "toggle-switch": {
        code: `<!-- Toggle Switch -->
    <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
      <div style="position: relative;">
        <input type="checkbox" style="display: none;">
        <div style="width: 50px; height: 24px; background: #e2e8f0; border-radius: 12px; position: relative; transition: background 0.2s ease;">
          <div style="position: absolute; left: 2px; top: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.2s ease;"></div>
        </div>
      </div>
      <span style="color: #333;">Toggle setting</span>
    </label>`,
        description: "Toggle switch component",
        tags: ["forms", "toggle", "ui"]
      },

      "mega-menu": {
        code: `<!-- Mega Menu -->
    <nav style="background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="max-width: 1200px; margin: 0 auto; padding: 1rem 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 1.5rem; font-weight: bold; color: #333;">Logo</div>
          <div style="display: flex; gap: 2rem;">
            <div style="position: relative;">
              <button style="background: none; border: none; color: #333; font-weight: 500; cursor: pointer; padding: 0.5rem 1rem;">Products</button>
            </div>
            <a href="#" style="text-decoration: none; color: #333; font-weight: 500; padding: 0.5rem 1rem;">Solutions</a>
            <a href="#" style="text-decoration: none; color: #333; font-weight: 500; padding: 0.5rem 1rem;">Pricing</a>
          </div>
        </div>
      </div>
    </nav>`,
        description: "Mega menu navigation",
        tags: ["navigation", "menu", "header"]
      },
      "breadcrumb-advanced": {
        code: `<!-- Advanced Breadcrumb -->
    <nav style="padding: 1rem 2rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
          <a href="#" style="color: #667eea; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </a>
          <span style="color: #a0aec0;">/</span>
          <a href="#" style="color: #667eea; text-decoration: none;">Products</a>
          <span style="color: #a0aec0;">/</span>
          <span style="color: #718096;">Current Page</span>
        </div>
      </div>
    </nav>`,
        description: "Breadcrumb with icons",
        tags: ["navigation", "breadcrumb", "icons"]
      }
    };

const componentCategories: ComponentCategories = {
  "Layout": ["header", "hero", "about", "services", "contact", "footer", "sidebar"],
  "Navigation": ["navbar", "breadcrumb", "breadcrumb-advanced", "mega-menu"],
  "Content": ["card", "gallery", "team", "testimonials", "stats", "timeline", "faq"],
  "Forms": ["contact", "login-form", "newsletter", "search-bar", "toggle-switch"],
  "UI Components": ["modal", "progress", "pricing", "primary-button", "secondary-button", "button-group"],
  "Documentation": ["readme-basic", "readme-advanced"],
  "SEO": ["seo", "seo-schema"],
  "Icons": ["social-icons", "feature-icons", "font-icons"]
};
