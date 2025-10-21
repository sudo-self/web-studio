"use client";

import { useEffect, useRef, useState } from "react";

interface PreviewPanelProps {
  code: string;
  onResizeStart?: (e: React.MouseEvent) => void;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function PreviewPanel({ code, onResizeStart }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateHtml = (bodyContent: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <!-- Set base URL so relative paths work -->
        <base href="${window.location.origin}/" />
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
          img { max-width: 100%; height: auto; display: block; }
        </style>
      </head>
      <body>${bodyContent}</body>
    </html>
  `;

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const updateIframe = (html: string) => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
    }
  };

  useEffect(() => {
    updateIframe(generateHtml(code));
  }, [code]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    updateIframe(generateHtml(code));
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("Preview refreshed");
    }, 600);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      addToast("Code copied to clipboard!");
    } catch (err) {
      addToast("Failed to copy code", "error");
      console.error("Failed to copy code:", err);
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
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const getDeviceWidth = () => {
    switch (deviceView) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  const getDeviceHeight = () => {
    switch (deviceView) {
      case "mobile":
        return "667px";
      case "tablet":
        return "1024px";
      default:
        return "100%";
    }
  };

  const deviceIcons = {
    mobile: "📱",
    tablet: "📟",
    desktop: "💻"
  };

  return (
    <div
      ref={panelRef}
      className="panel preview-panel relative"
    >
      {/* Resize Handle */}
      <div
        className="absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-interactive-accent/20 transition-colors duration-200 rounded"
        onMouseDown={onResizeStart}
      />

      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Preview</h2>
          <div className="flex items-center gap-1 text-xs text-text-tertiary">
            <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-interactive-accent animate-pulse' : 'bg-interactive-success'}`} />
            {isRefreshing ? 'Refreshing...' : 'Live'}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <div className="flex items-center gap-2">
                <div className="loading-spinner w-3 h-3" />
                Refreshing
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </div>
            )}
          </button>
          
          <button 
            className={`btn ${showEmbed ? 'btn-accent' : 'btn-outline'} btn-sm`}
            onClick={() => setShowEmbed(!showEmbed)}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              {showEmbed ? "Hide Code" : "Show Code"}
            </div>
          </button>
          
          <button 
            className={`btn ${isFullscreen ? 'btn-warning' : 'btn-outline'} btn-sm`}
            onClick={handleFullscreen}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
              {isFullscreen ? "Exit Full" : "Fullscreen"}
            </div>
          </button>
        </div>
      </div>

      {/* Code Section */}
      {showEmbed && (
        <div className="bg-surface-primary border border-border-primary rounded-lg mb-4 overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center p-4 border-b border-border-primary bg-surface-secondary">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-interactive-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="font-semibold text-sm text-text-primary">Component Code</span>
            </div>
            <button 
              className="btn btn-success btn-sm flex items-center gap-2"
              onClick={handleCopy}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
          <div className="p-4 max-h-48 overflow-auto bg-surface-tertiary">
            <pre className="m-0 text-sm font-mono text-text-primary overflow-x-auto whitespace-pre-wrap leading-6">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 relative min-h-0 flex justify-center items-start p-6 overflow-auto bg-surface-secondary rounded-lg">
        <div
          className="shadow-xl transition-all duration-500 ease-out bg-white rounded-xl overflow-hidden border border-border-primary"
          style={{
            width: getDeviceWidth(),
            height: getDeviceHeight(),
            maxHeight: "100%",
            transform: deviceView === "desktop" ? "none" : "scale(0.9)",
            transformOrigin: "top center",
          }}
        >
          {/* Device Frame */}
          {deviceView !== "desktop" && (
            <div className="absolute inset-0 pointer-events-none border-8 border-gray-800 rounded-xl z-10" />
          )}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none bg-white"
            title="Live Preview"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>

      {/* Device Controls */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-10 bg-surface-primary/80 backdrop-blur-sm rounded-lg p-2 border border-border-primary shadow-lg">
        {(["mobile", "tablet", "desktop"] as const).map((device) => (
          <button
            key={device}
            onClick={() => setDeviceView(device)}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 flex items-center gap-2 ${
              deviceView === device
                ? "bg-interactive-accent text-white shadow-md transform scale-105"
                : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary hover:shadow-sm"
            }`}
          >
            <span className="text-base">{deviceIcons[device]}</span>
            <span className="capitalize">{device}</span>
          </button>
        ))}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transform transition-all duration-300 animate-in slide-in-from-right-8 ${
              toast.type === "success" 
                ? "bg-interactive-success/10 border-interactive-success/20 text-interactive-success" 
                : "bg-interactive-danger/10 border-interactive-danger/20 text-interactive-danger"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              toast.type === "success" ? "bg-interactive-success" : "bg-interactive-danger"
            }`} />
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-current hover:opacity-70 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-in {
          animation-duration: 300ms;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .slide-in-from-right-8 {
          animation-name: slideInFromRight;
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}










