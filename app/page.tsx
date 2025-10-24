"use client";

import { useState, useRef, useEffect } from "react";
import ComponentsPanel from "@/components/ComponentsPanel";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import StatusBar from "@/components/StatusBar";
import SettingsPanel from "@/components/SettingsPanel";

export default function Home() {
  const [framework, setFramework] = useState("html");
  

  const htmlCode = `<!-- Welcome to studio.jessejesse.com -->
<div class="welcome-container">
  <div class="welcome-content">
    <!-- Main Header -->
    <header class="welcome-header">
      <div class="logo-container">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h1 class="welcome-title">Your Awesome Website</h1>
      </div>
      <p class="welcome-subtitle">Ready-made components, lightning-fast AI builder, direct code editor, and instant GitHub publishing.</p>
    </header>

    <button class="welcome-btn" onclick="alert('Let\\'s start building!')">
      <span class="btn-content">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Start Building
      </span>
    </button>

 
    <nav class="feature-nav">
      <a href="#" class="feature-link">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <span class="feature-text">Components</span>
      </a>

      <a href="#" class="feature-link">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <span class="feature-text">AI Builder</span>
      </a>

      <a href="#" class="feature-link">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <span class="feature-text">Code Editor</span>
      </a>
    </nav>

    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">50+</div>
        <div class="stat-label">Components</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">AI</div>
        <div class="stat-label">Powered</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">100%</div>
        <div class="stat-label">Customizable</div>
      </div>
    </div>
  </div>

  <style>
    .welcome-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 3rem 2rem;
      background: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .welcome-content {
      max-width: 580px;
      text-align: center;
      animation: fadeInUp 0.8s ease-out;
    }

    .welcome-header {
      margin-bottom: 3rem;
    }

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
    }

    .logo-icon svg {
      width: 24px;
      height: 24px;
    }

    .welcome-title {
      font-size: 3rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.025em;
      background: linear-gradient(135deg, #0f172a, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .welcome-subtitle {
      font-size: 1.25rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .welcome-btn {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
      margin-bottom: 3rem;
      position: relative;
      overflow: hidden;
    }

    .welcome-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
    }

    .welcome-btn:active {
      transform: translateY(0);
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-icon {
      width: 20px;
      height: 20px;
    }

    .feature-nav {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .feature-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      color: #64748b;
      transition: all 0.3s ease;
      border: 1px solid transparent;
      min-width: 120px;
    }

    .feature-link:hover {
      background: #ffffff;
      color: #8b5cf6;
      border-color: #8b5cf6;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: #ffffff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8b5cf6;
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
    }

    .feature-link:hover .feature-icon {
      background: #8b5cf6;
      color: white;
      border-color: #8b5cf6;
    }

    .feature-icon svg {
      width: 24px;
      height: 24px;
    }

    .feature-text {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .quick-stats {
      display: flex;
      gap: 3rem;
      justify-content: center;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #8b5cf6;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .welcome-title {
        font-size: 2.25rem;
      }
      
      .welcome-subtitle {
        font-size: 1.125rem;
      }
      
      .feature-nav {
        gap: 1rem;
      }
      
      .quick-stats {
        gap: 2rem;
      }
    }
  </style>
</div>`;

const reactCode = `// React Mode
function WelcomeApp() {
  return React.createElement('div', { 
    style: { 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: '3rem 2rem',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }
  }, 
    React.createElement('div', { 
      style: { 
        maxWidth: '600px', 
        textAlign: 'center'
      }
    },
      React.createElement('header', { style: { marginBottom: '3rem' } },
        React.createElement('div', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1rem', 
            marginBottom: '1.5rem' 
          }
        },
          React.createElement('div', {
            style: {
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #0891b2, #0e7490)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 20px rgba(8, 145, 178, 0.3)'
            }
          },
            React.createElement('svg', { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" },
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" })
            )
          ),
          React.createElement('h1', {
            style: {
              fontSize: '3rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.025em',
              background: 'linear-gradient(135deg, #0f172a, #0891b2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }
          }, 'React App')
        ),
        React.createElement('p', {
          style: {
            fontSize: '1.25rem',
            color: '#64748b',
            lineHeight: '1.6',
            margin: 0,
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }
        }, 'Build React Components')
      ),
      React.createElement('button', { 
        style: {
          background: 'linear-gradient(135deg, #0891b2, #0e7490)',
          color: 'white',
          border: 'none',
          padding: '1rem 2.5rem',
          fontSize: '1.125rem',
          fontWeight: '600',
          cursor: 'pointer',
          borderRadius: '12px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 14px rgba(8, 145, 178, 0.4)',
          marginBottom: '3rem'
        },
        onClick: () => alert('Hello from React!')
      },
        React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' } },
          React.createElement('svg', { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 10V3L4 14h7v7l9-11h-7z" })
          ),
          'Start Building'
        )
      )
    )
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(WelcomeApp));`;

  const [code, setCode] = useState(htmlCode); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [panelWidths, setPanelWidths] = useState({
    components: 300,
    editor: 550,
    preview: 400,
  });
  const [resizingPanel, setResizingPanel] = useState<string | null>(null);

  const startXRef = useRef<number>(0);
  const startWidthsRef = useRef(panelWidths);


  useEffect(() => {
    if (framework === "react") {
      setCode(reactCode);
    } else {
      setCode(htmlCode);
    }
  }, [framework]);

  const runCode = () => {
    setCode(prev => prev + "");
  };

  const formatCode = () => {
    const formatted = code.replace(/(>)(<)/g, "$1\n$2");
    setCode(formatted);
  };

  const insertComponent = (html: string) => {
    setCode(prev => prev + "\n" + html);
  };

  const insertAiCode = (html: string) => {
    setCode(prev => prev + "\n" + html);
  };

  const handleResizeStart = (panel: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingPanel(panel);
    startXRef.current = e.clientX;
    startWidthsRef.current = { ...panelWidths };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    if (!resizingPanel) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startXRef.current;

      setPanelWidths((prev) => {
        const newWidths = { ...prev };

        if (resizingPanel === "components") {
          const newWidth = Math.max(
            240,
            Math.min(500, startWidthsRef.current.components + deltaX)
          );
          newWidths.components = newWidth;
        } else if (resizingPanel === "editor") {
          const newWidth = Math.max(
            400,
            Math.min(800, startWidthsRef.current.editor + deltaX)
          );
          newWidths.editor = newWidth;
        }

        return newWidths;
      });
    };

    const handleMouseUp = () => {
      setResizingPanel(null);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingPanel]);

  return (
    <>
      <div className="app-container">
        <div className="main-content">
          <div
            className="panel components-panel"
            style={{
              width: `${panelWidths.components}px`,
              minWidth: "240px",
              maxWidth: "480px",
              flex: "0 0 auto",
            }}
          >
            <ComponentsPanel
              onInsert={insertComponent}
              onAiInsert={insertAiCode}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onResizeStart={(e) => handleResizeStart("components", e)}
              currentCode={code}
              framework={framework}
            />
          </div>

          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart("components", e)}
          />

          <div
            className="panel editor-panel"
            style={{
              width: `${panelWidths.editor}px`,
              minWidth: "400px",
              maxWidth: "800px",
              flex: "0 0 auto",
            }}
          >
            <EditorPanel
              code={code}
              setCode={setCode}
              runCode={runCode}
              formatCode={formatCode}
              onResizeStart={(e) => handleResizeStart("editor", e)}
              framework={framework}
              setFramework={setFramework}
            />
          </div>

          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart("editor", e)}
          />

          <div
            className="panel preview-panel"
            style={{ flex: 1, minWidth: "400px" }}
          >
            <PreviewPanel
              code={code}
              onResizeStart={(e) => handleResizeStart("preview", e)}
              framework={framework}
            />
          </div>
        </div>

        <StatusBar />
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <style jsx global>{`
        .resize-handle {
          width: 8px;
          cursor: col-resize;
          background: var(--border-primary);
          transition: all 0.2s ease;
          position: relative;
        }

        .resize-handle:hover {
          background: var(--interactive-accent);
        }

        .resize-handle::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 2px;
          height: 20px;
          background: var(--text-tertiary);
          border-radius: 1px;
          opacity: 0.6;
        }

        .resize-handle:hover::before {
          background: white;
          opacity: 1;
        }

        body.resizing {
          cursor: col-resize !important;
          user-select: none !important;
        }
      `}</style>
    </>
  );
}
