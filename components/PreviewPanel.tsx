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
  const [iframeVisible, setIframeVisible] = useState(false);

  // Generates HTML for iframe based on framework
  const generateHtml = (content: string, currentFramework: string) => {
    if (currentFramework === "react") {
      const reactCode = content.trim();
      const hasFunctionComponent = reactCode.includes('function') || reactCode.includes('const') || reactCode.includes('=>');
      const hasClassComponent = reactCode.includes('class') && reactCode.includes('extends');
      const hasJSX = reactCode.includes('<') && reactCode.includes('>');
      const hasReactDOMRender = reactCode.includes('ReactDOM.render') || reactCode.includes('root.render');

      let finalReactCode = reactCode;

      if (!hasReactDOMRender && (hasJSX || hasFunctionComponent || hasClassComponent)) {
        // Detect component name
        let componentName = "App";
        const functionMatch = reactCode.match(/function\s+(\w+)/);
        if (functionMatch) componentName = functionMatch[1];
        else {
          const constMatch = reactCode.match(/(?:const|let|var)\s+(\w+)\s*=/);
          if (constMatch) componentName = constMatch[1];
        }

        finalReactCode = `
          ${reactCode}
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(<${componentName} />);
        `;
      } else if (!hasReactDOMRender) {
        // Fallback
        finalReactCode = `
          function App() {
            return (
              <div style={{
                padding: '20px', fontFamily: 'system-ui', color: '#333',
                background: '#f5f5f5', borderRadius: '8px', maxWidth: '600px', margin: '0 auto'
              }}>
                <h2 style={{marginBottom:'16px', color:'#1976d2'}}>React Preview</h2>
                <p>Your React code is being processed. Include a function component returning JSX.</p>
                <pre style={{
                  whiteSpace: 'pre-wrap', background:'#f8f8f8', padding:'10px', borderRadius:'4px'
                }}>${reactCode.substring(0, 500)}${reactCode.length>500?'...':''}</pre>
              </div>
            );
          }
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(<App />);
        `;
      }

      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            *{margin:0;padding:0;box-sizing:border-box;}
            body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;color:#333;line-height:1.6;background:#fff;}
            #root{width:100%;min-height:100vh;}
            .loading{display:flex;align-items:center;justify-content:center;min-height:200px;color:#666;font-size:16px;}
            .error{color:#d32f2f;padding:20px;border:1px solid #f44336;border-radius:8px;background:#ffebee;margin:20px;}
            .error pre{white-space:pre-wrap;margin-top:10px;font-size:12px;background:rgba(0,0,0,0.05);padding:10px;border-radius:4px;}
          </style>
        </head>
        <body>
          <div id="root"><div class="loading">Loading React preview...</div></div>
          <script type="text/babel">
            (function(){
              try { ${finalReactCode} } 
              catch(e) {
                const root = document.getElementById('root');
                if(root){ root.innerHTML='<div class="error"><h3>React Error:</h3><pre>'+e.stack+'</pre></div>'; }
              }
            })();
          </script>
        </body>
        </html>
      `;
    }

    // HTML fallback
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;margin:0;padding:0;min-height:100vh;background:#fff;line-height:1.6;}
          *{box-sizing:border-box;}
          img{max-width:100%;height:auto;display:block;}
          a{color:#1976d2;text-decoration:none;} a:hover{text-decoration:underline;}
        </style>
      </head>
      <body>${content}</body>
      </html>
    `;
  };

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const updateIframe = (html: string) => {
    if (iframeRef.current) {
      setIframeVisible(false);
      iframeRef.current.srcdoc = html;
    }
  };

  useEffect(() => {
    const html = generateHtml(code, framework);
    updateIframe(html);
  }, [code, framework]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const html = generateHtml(code, framework);
    updateIframe(html);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("Preview refreshed");
    }, 600);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); addToast("Code copied to clipboard!"); }
    catch { addToast("Failed to copy code", "error"); }
  };

  const handleFullscreen = () => {
    if (!panelRef.current) return;
    if (!isFullscreen) panelRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  const deviceSizes = {
    mobile: { width: "375px", height: "667px" },
    tablet: { width: "768px", height: "1024px" },
    desktop: { width: "100%", height: "100%" },
  };

  const deviceIcons = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };

  return (
    <div ref={panelRef} className="panel preview-panel relative flex flex-col h-full bg-surface-primary">

      {onResizeStart && (
        <div
          className="absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-interactive-accent/20 transition-colors duration-200 rounded"
          onMouseDown={onResizeStart}
        />
      )}

      {/* Header */}
      <div className="panel-header flex justify-between items-center p-4 border-b border-border-primary bg-surface-secondary">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">Preview</h2>
          <span className="text-sm text-text-tertiary bg-surface-tertiary px-2 py-1 rounded border border-border-primary">
            {framework === "react" ? "React" : "HTML"}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className={`btn btn-sm ${showEmbed ? "btn-accent" : "btn-outline"}`} onClick={() => setShowEmbed(!showEmbed)}>
            {showEmbed ? "Hide Code" : "Show Code"}
          </button>
          <button className={`btn btn-sm ${isFullscreen ? "btn-warning" : "btn-outline"}`} onClick={handleFullscreen}>
            {isFullscreen ? "Exit Full" : "Fullscreen"}
          </button>
          <button className={`btn btn-sm ${showGrid ? "btn-accent" : "btn-outline"}`} onClick={() => setShowGrid(prev => !prev)}>
            {showGrid ? "Hide Grid" : "Show Grid"}
          </button>
        </div>
      </div>

      {/* Code Section */}
      {showEmbed && (
        <div className="bg-surface-primary border border-border-primary rounded-lg m-4 overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center p-3 border-b border-border-primary bg-surface-secondary">
            <span className="font-semibold text-sm text-text-primary">Component Code</span>
            <button className="btn btn-success btn-sm" onClick={handleCopy}>Copy Code</button>
          </div>
          <div className="p-4 max-h-48 overflow-auto bg-surface-tertiary">
            <pre className="m-0 text-sm font-mono text-text-primary whitespace-pre-wrap leading-6"><code>{code}</code></pre>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 relative min-h-0 flex justify-center items-start p-4 overflow-auto bg-surface-secondary">
        <div
          className="shadow-xl transition-all duration-500 ease-out bg-white rounded-xl overflow-hidden border border-border-primary relative"
          style={{
            width: deviceSizes[deviceView].width,
            height: deviceSizes[deviceView].height,
            maxHeight: "100%",
          }}
        >
          {showGrid && <GridPattern width={40} height={40} stroke="rgba(0,0,0,0.05)" className="absolute inset-0 z-10 pointer-events-none" />}
          {deviceView !== "desktop" && <div className="absolute inset-0 pointer-events-none border-8 border-gray-800 rounded-xl z-20" />}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none bg-white relative z-0"
            title="Live Preview"
            sandbox="allow-same-origin allow-scripts"
            style={{ visibility: iframeVisible ? "visible" : "hidden" }}
            onLoad={() => setTimeout(() => setIframeVisible(true), 100)}
          />
        </div>
      </div>

      {/* Device Controls */}
      <div className="flex justify-center items-center gap-2 p-3 border-t border-border-primary bg-surface-secondary">
        {(["mobile", "tablet", "desktop"] as const).map(device => {
          const isActive = deviceView === device;
          const Icon = deviceIcons[device];
          return (
            <button key={device} onClick={() => setDeviceView(device)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive ? "bg-interactive-accent text-white shadow-sm" : "bg-surface-primary text-text-primary hover:bg-surface-tertiary"
              }`}>
              <Icon className="w-4 h-4" />
              <span className="capitalize">{device}</span>
            </button>
          );
        })}
      </div>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === "success"
              ? "bg-interactive-success/10 border-interactive-success/20 text-interactive-success"
              : "bg-interactive-danger/10 border-interactive-danger/20 text-interactive-danger"
          }`}>
            <div className={`w-2 h-2 rounded-full ${toast.type==="success"?"bg-interactive-success":"bg-interactive-danger"}`} />
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-current hover:opacity-70 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

