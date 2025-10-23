"use client";

import { useEffect, useRef, useState } from "react";
import { GridPattern } from "./GridPattern";
import { Smartphone, Tablet, Monitor } from "lucide-react";

interface PreviewPanelProps {
  code: string;
  onResizeStart?: (e: React.MouseEvent) => void;
  framework: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function PreviewPanel({ code, onResizeStart, framework }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateHtml = (content: string, currentFramework: string) => {
    if (currentFramework === "react") {
      // For React, check if the code is already a complete React component
      const reactCode = content.trim();
      
      // Check what kind of React code we have
      const hasFunctionComponent = reactCode.includes('function') || reactCode.includes('const') || reactCode.includes('=>');
      const hasClassComponent = reactCode.includes('class') && reactCode.includes('extends');
      const hasJSX = reactCode.includes('<') && reactCode.includes('>');
      const hasReactDOMRender = reactCode.includes('ReactDOM.render');
      
      let finalReactCode = reactCode;
      
      if (!hasReactDOMRender) {
        if ((hasFunctionComponent || hasClassComponent) && hasJSX) {
          // It's a component but missing render - extract component name and render it
          let componentName = 'App';
          
          // Try to extract component name from function declaration
          const functionMatch = reactCode.match(/function\s+(\w+)/);
          if (functionMatch) {
            componentName = functionMatch[1];
          } else {
            // Try to extract from const/let declaration
            const constMatch = reactCode.match(/(?:const|let|var)\s+(\w+)\s*=/);
            if (constMatch) {
              componentName = constMatch[1];
            }
          }
          
          finalReactCode = `${reactCode}\nReactDOM.render(<${componentName} />, document.getElementById('root'));`;
        } else if (hasJSX && !hasFunctionComponent && !hasClassComponent) {
          // It's just JSX - wrap it in a component
          finalReactCode = `
            function App() {
              return (
                ${reactCode}
              );
            }
            ReactDOM.render(<App />, document.getElementById('root'));
          `;
        } else {
          // It's incomplete or malformed React code
          finalReactCode = `
            function App() {
              return (
                <div style={{ padding: '20px', fontFamily: 'system-ui', color: '#333', background: '#f5f5f5', borderRadius: '8px' }}>
                  <h2>React Preview</h2>
                  <p>Your React code needs to be a complete component with JSX.</p>
                  <div style={{ background: '#fff', padding: '15px', borderRadius: '5px', marginTop: '10px', border: '1px solid #ddd' }}>
                    <strong>Your code:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', margin: '10px 0 0 0' }}>${reactCode}</pre>
                  </div>
                  <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                    <strong>Tip:</strong> Make sure your code includes a function component and returns JSX.
                  </p>
                </div>
              );
            }
            ReactDOM.render(<App />, document.getElementById('root'));
          `;
        }
      }

      return `
        <!DOCTYPE html>
        <html>
          <head>
            <base href="${window.location.origin}/" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 0; 
                padding: 20px; 
                min-height: 100vh; 
                background: #fff; 
                line-height: 1.6; 
              }
              * { box-sizing: border-box; }
              img { max-width: 100%; height: auto; display: block; }
              #root { width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <div id="root">
              <div style="padding: 20px; text-align: center; color: #666;">
                Loading React preview...
              </div>
            </div>
            <script type="text/babel">
              try {
                ${finalReactCode}
              } catch (error) {
                console.error('React error:', error);
                document.getElementById('root').innerHTML = 
                  '<div style="color: #d32f2f; padding: 20px; border: 1px solid #f44336; border-radius: 8px; margin: 20px; background: #ffebee; font-family: system-ui;">' +
                  '<h3 style="margin: 0 0 10px 0;">React Error:</h3>' +
                  '<pre style="white-space: pre-wrap; background: #fff; padding: 10px; border-radius: 4px; border: 1px solid #ffcdd2; margin: 10px 0; font-size: 12px;">' + error.toString() + '</pre>' +
                  '<p style="margin: 10px 0 0 0; font-size: 14px;"><strong>Debug Tips:</strong></p>' +
                  '<ul style="margin: 5px 0; padding-left: 20px; font-size: 13px;">' +
                  '<li>Make sure your component returns valid JSX</li>' +
                  '<li>Check for missing parentheses or brackets</li>' +
                  '<li>Ensure all tags are properly closed</li>' +
                  '<li>Verify component names match</li>' +
                  '</ul></div>';
              }
            </script>
          </body>
        </html>
      `;
    } else {
      // For HTML, use the original approach
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <base href="${window.location.origin}/" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 0; 
                padding: 0; 
                min-height: 100vh; 
                background: #fff; 
                line-height: 1.6; 
              }
              * { box-sizing: border-box; }
              img { max-width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `;
    }
  };

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const updateIframe = (html: string) => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
    }
  };

  useEffect(() => {
    updateIframe(generateHtml(code, framework));
  }, [code, framework]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    updateIframe(generateHtml(code, framework));
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("Preview refreshed");
    }, 600);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      addToast("Code copied to clipboard!");
    } catch {
      addToast("Failed to copy code", "error");
    }
  };

  const handleFullscreen = () => {
    if (!panelRef.current) return;
    if (!isFullscreen && panelRef.current.requestFullscreen) {
      panelRef.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const listener = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", listener);
    return () => document.removeEventListener("fullscreenchange", listener);
  }, []);

  const getDeviceWidth = () => deviceView === "mobile" ? "375px" : deviceView === "tablet" ? "768px" : "100%";
  const getDeviceHeight = () => deviceView === "mobile" ? "667px" : deviceView === "tablet" ? "1024px" : "100%";

  const deviceIcons = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };

  return (
    <div ref={panelRef} className="panel preview-panel relative">

      {/* Resize Handle */}
      {onResizeStart && (
        <div
          className="absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-interactive-accent/20 transition-colors duration-200 rounded"
          onMouseDown={onResizeStart}
        />
      )}

      {/* Header */}
      <div className="panel-header flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Preview</h2>
          <span className="text-sm text-text-tertiary bg-surface-tertiary px-2 py-1 rounded border border-border-primary">
            {framework === "react" ? "React" : "HTML"}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className={`btn ${showEmbed ? "btn-accent" : "btn-outline"} btn-sm`} onClick={() => setShowEmbed(!showEmbed)}>
            {showEmbed ? "Hide Code" : "Show Code"}
          </button>
          <button className={`btn ${isFullscreen ? "btn-warning" : "btn-outline"} btn-sm`} onClick={handleFullscreen}>
            {isFullscreen ? "Exit Full" : "Fullscreen"}
          </button>
          <button className={`btn ${showGrid ? "btn-accent" : "btn-outline"} btn-sm`} onClick={() => setShowGrid(prev => !prev)}>
            {showGrid ? "Hide Grid" : "Show Grid"}
          </button>
        </div>
      </div>

      {/* Code Section */}
      {showEmbed && (
        <div className="bg-surface-primary border border-border-primary rounded-lg mb-4 overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center p-4 border-b border-border-primary bg-surface-secondary">
            <span className="font-semibold text-sm text-text-primary">Component Code</span>
            <button className="btn btn-success btn-sm" onClick={handleCopy}>Copy</button>
          </div>
          <div className="p-4 max-h-48 overflow-auto bg-surface-tertiary">
            <pre className="m-0 text-sm font-mono text-text-primary whitespace-pre-wrap leading-6">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 relative min-h-0 flex justify-center items-start p-6 overflow-auto bg-surface-secondary rounded-lg">
        <div className="shadow-xl transition-all duration-500 ease-out bg-white rounded-xl overflow-hidden border border-border-primary relative"
          style={{
            width: getDeviceWidth(),
            height: getDeviceHeight(),
            maxHeight: "100%",
            transform: deviceView === "desktop" ? "none" : "scale(0.9)",
            transformOrigin: "top center",
          }}
        >
          {showGrid && <GridPattern width={40} height={40} stroke="rgba(0,0,0,0.05)" className="absolute inset-0 z-10" />}
          {deviceView !== "desktop" && (
            <div className="absolute inset-0 pointer-events-none border-8 border-gray-800 rounded-xl z-20" />
          )}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none bg-white relative z-0"
            title="Live Preview"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>

      {/* Device Controls Footer */}
      <div className="flex justify-center items-center gap-2 p-2 border-t border-border-primary bg-surface-secondary rounded-b-lg mt-2">
        {(["mobile", "tablet", "desktop"] as const).map(d => {
          const isActive = deviceView === d;
          const Icon = deviceIcons[d];
          return (
            <button
              key={d}
              onClick={() => setDeviceView(d)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                ${isActive ? "bg-interactive-accent text-white" : "bg-surface-primary text-text-primary"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="capitalize">{d}</span>
            </button>
          );
        })}
      </div>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${t.type==="success"?"bg-interactive-success/10 border-interactive-success/20 text-interactive-success":"bg-interactive-danger/10 border-interactive-danger/20 text-interactive-danger"}`}>
            <div className={`w-2 h-2 rounded-full ${t.type==="success"?"bg-interactive-success":"bg-interactive-danger"}`} />
            <span className="text-sm font-medium">{t.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(to => to.id!==t.id))} className="text-current hover:opacity-70 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}































