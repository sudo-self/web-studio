"use client";

import { useEffect, useRef, useState } from "react";

interface PreviewPanelProps {
  code: string;
  onResizeStart?: (e: React.MouseEvent) => void;
}

export default function PreviewPanel({ code, onResizeStart }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("desktop");

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

  const updateIframe = (html: string) => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
    }
  };

  useEffect(() => {
    updateIframe(generateHtml(code));
  }, [code]);

  const handleRefresh = () => updateIframe(generateHtml(code));

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => alert("Code copied to clipboard!"))
      .catch(err => console.error("Failed to copy code:", err));
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

  // Device preview width
  const getDeviceWidth = () => {
    switch (deviceView) {
      case "mobile":
        return "375px"; // iPhone size
      case "tablet":
        return "768px"; // iPad portrait
      default:
        return "100%"; // desktop full
    }
  };

  return (
    <div
      ref={panelRef}
      className="flex flex-col h-full relative bg-panel-bg rounded-lg overflow-hidden"
    >
      {/* Resize Handle */}
      <div
        className="absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-20"
        onMouseDown={onResizeStart}
      />

      {/* Header */}
      <div className="panel-header">
        <h2>Preview</h2>
        <div className="flex gap-3 flex-wrap">
          <button className="btn btn-primary" onClick={handleRefresh}>Refresh</button>
          <button className="btn btn-warning" onClick={() => setShowEmbed(!showEmbed)}>
            {showEmbed ? "Close Code" : "Show Code"}
          </button>
          <button className="btn btn-success" onClick={handleFullscreen}>
            {isFullscreen ? "Exit Full" : "Fullscreen"}
          </button>
        </div>
      </div>

      {/* Code Section */}
      {showEmbed && (
        <div className="bg-gray-900 text-white p-4 border-b border-panel-border max-h-48 overflow-auto flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <strong className="text-sm font-semibold">Embed Code</strong>
            <button className="btn btn-primary btn-sm" onClick={handleCopy}>Copy</button>
          </div>
          <pre className="m-0 text-xs font-mono bg-transparent overflow-x-auto whitespace-pre-wrap leading-5">
            <code>{code}</code>
          </pre>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 relative min-h-0 flex justify-center items-start p-4 overflow-auto">
        <div
          className="shadow-lg transition-all duration-300 ease-in-out"
          style={{
            width: getDeviceWidth(),
            height: "100%",
            maxHeight: "100%",
            border: "1px solid var(--panel-border)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none block bg-white"
            title="Preview"
          />
        </div>
      </div>

      {/* Device Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-5">
        {(["mobile", "tablet", "desktop"] as const).map((device) => (
          <button
            key={device}
            onClick={() => setDeviceView(device)}
            className={`px-3 py-2 rounded text-xs cursor-pointer transition-colors duration-200 ${
              deviceView === device
                ? "bg-blue-600 text-white"
                : "bg-component-bg text-foreground hover:bg-component-hover"
            }`}
          >
            {device}
          </button>
        ))}
      </div>

      <style jsx>{`
        .bg-panel-bg { background-color: var(--panel-bg); }
        .border-panel-border { border-color: var(--panel-border); }
        .text-foreground { color: var(--foreground); }
        .bg-component-bg { background-color: var(--component-bg); }
        .bg-component-hover { background-color: var(--component-hover); }
        .btn-sm { padding: 6px 12px; font-size: 12px; min-width: 70px; }
      `}</style>
    </div>
  );
}









