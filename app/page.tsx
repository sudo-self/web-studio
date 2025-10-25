"use client";

import { useState, useRef, useEffect } from "react";
import ComponentsPanel from "@/components/ComponentsPanel";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import StatusBar from "@/components/StatusBar";
import SettingsPanel from "@/components/SettingsPanel";

export default function Home() {
  const [framework, setFramework] = useState("html");
  
  const htmlCode = `
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 3rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; text-align: center; color: white;">
    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 2rem;">
      <div style="width: 64px; height: 64px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2">
          <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
        </svg>
      </div>
      <h1 style="font-size: 3rem; font-weight: 800; margin: 0; letter-spacing: -0.02em;">Your Website</h1>
    </div>
    
    <p style="font-size: 1.5rem; margin-bottom: 3rem; opacity: 0.95; line-height: 1.5;">
    publish beautiful websites with ready made components and the AI-powered builder.
    </p>
    
    <button onclick="alert('Start building amazing websites!')" style="background: white; color: #667eea; border: none; padding: 16px 48px; font-size: 1.125rem; font-weight: 600; border-radius: 12px; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.15); transition: transform 0.2s, box-shadow 0.2s;">
      Get Started
    </button>
    
    <div style="display: flex; gap: 4rem; justify-content: center; margin-top: 4rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.2);">
      <div>
        <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">50+</div>
        <div style="font-size: 0.875rem; opacity: 0.8;">Components</div>
      </div>
      <div>
        <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">AI</div>
        <div style="font-size: 0.875rem; opacity: 0.8;">Powered</div>
      </div>
      <div>
        <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">100%</div>
        <div style="font-size: 0.875rem; opacity: 0.8;">Free</div>
      </div>
    </div>
  </div>
</div>`;

    // React app gets cyan-500 with gradient blues
    const reactCode = `function App() {
    const [count, setCount] = useState(0);
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #1d4ed8 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '600px', 
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              margin: 0,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              React App
            </h1>
          </div>
          
          <p style={{ 
            fontSize: '1.5rem', 
            marginBottom: '3rem',
            opacity: 0.95,
            lineHeight: 1.5,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Interactive components with React hooks
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <button 
              onClick={() => setCount(count - 1)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.5)',
                padding: '12px 24px',
                fontSize: '1.5rem',
                fontWeight: '700',
                borderRadius: '12px',
                cursor: 'pointer',
                minWidth: '60px',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
            >
              −
            </button>
            
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              color: '#06b6d4',
              padding: '20px 40px',
              fontSize: '3rem',
              fontWeight: '800',
              borderRadius: '16px',
              minWidth: '140px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {count}
            </div>
            
            <button 
              onClick={() => setCount(count + 1)}
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: '#06b6d4',
                border: 'none',
                padding: '12px 24px',
                fontSize: '1.5rem',
                fontWeight: '700',
                borderRadius: '12px',
                cursor: 'pointer',
                minWidth: '60px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
            >
              +
            </button>
          </div>
          
          <button 
            onClick={() => setCount(0)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 32px',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '3rem',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)'
            }}
          >
            Reset Counter
          </button>
          
          <div style={{ 
            display: 'flex', 
            gap: '4rem', 
            justifyContent: 'center',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                useState
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>React Hook</div>
            </div>
            <div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                JSX
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Syntax</div>
            </div>
            <div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Live
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Preview</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));`;
  const [code, setCode] = useState(htmlCode);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [panelWidths, setPanelWidths] = useState({
    components: 260,
    editor: 540,
    preview: 460,
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
  }, [framework, htmlCode, reactCode]);

  const runCode = () => {
   
    setCode(prev => prev + "");
  };

  const formatCode = () => {
    if (framework === "html") {
      // Simple HTML formatting
      const formatted = code
        .replace(/(>)(<)/g, "$1\n$2")
        .replace(/(<\w+[^>]*>)([^<]+)(<\/\w+>)/g, "$1\n  $2\n$3");
      setCode(formatted);
    } else {
      // React formatting - preserve structure
      setCode(code);
    }
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
          newWidths.components = Math.max(
            240,
            Math.min(500, startWidthsRef.current.components + deltaX)
          );
        } else if (resizingPanel === "editor") {
          newWidths.editor = Math.max(
            400,
            Math.min(800, startWidthsRef.current.editor + deltaX)
          );
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
          {/* Components Panel */}
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

          {/* Resize Handle 1 */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart("components", e)}
            aria-label="Resize components panel"
          />

          {/* Editor Panel */}
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

          {/* Resize Handle 2 */}
          <div
            className="resize-handle"
            onMouseDown={(e) => handleResizeStart("editor", e)}
            aria-label="Resize editor panel"
          />

          {/* Preview Panel */}
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

        /* Smooth transitions for panel resizing */
        .panel {
          transition: box-shadow 0.2s ease;
        }

        .panel:hover {
          box-shadow: var(--shadow-lg);
        }

        /* Loading states */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .loading {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--surface-secondary);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--border-primary);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--interactive-accent);
        }
      `}</style>
    </>
  );
}
