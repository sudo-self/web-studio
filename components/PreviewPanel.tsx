"use client";

import { useEffect, useRef, useState } from "react";
import { GridPattern } from "./GridPattern";
import { Smartphone, Tablet, Monitor } from "lucide-react";

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
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateHtml = (bodyContent: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <base href="${window.location.origin}/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin:0; padding:0; min-height:100vh; background:#fff; line-height:1.6; }
          * { box-sizing: border-box; }
          img { max-width:100%; height:auto; display:block; }
        </style>
      </head>
      <body>${bodyContent}</body>
    </html>
  `;

  const updateIframe = (html: string) => {
    if (iframeRef.current) iframeRef.current.srcdoc = html;
  };

  useEffect(() => {
    updateIframe(generateHtml(code));
  }, [code]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    updateIframe(generateHtml(code));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); } catch {}
  };

  const getDeviceWidth = () => deviceView === "mobile" ? "375px" : deviceView === "tablet" ? "768px" : "100%";
  const getDeviceHeight = () => deviceView === "mobile" ? "667px" : deviceView === "tablet" ? "1024px" : "600px";

  const deviceIcons = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };

  return (
    <div ref={panelRef} className="panel preview-panel relative flex flex-col h-full">

      {/* Header */}
      <div className="panel-header flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold tracking-tight">Preview</h2>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={handleRefresh} disabled={isRefreshing}>Refresh</button>
          <button className={`btn ${showEmbed ? "btn-accent" : "btn-outline"} btn-sm`} onClick={() => setShowEmbed(!showEmbed)}>
            {showEmbed ? "Hide Code" : "Show Code"}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 relative flex justify-center items-start p-2 overflow-auto bg-surface-secondary rounded-lg">
        <div
          className="shadow-xl bg-white rounded-xl overflow-hidden border border-border-primary relative flex-shrink-0"
          style={{
            width: getDeviceWidth(),
            height: getDeviceHeight(),
            maxHeight: "100%",
          }}
        >
          {showGrid && <GridPattern width={40} height={40} stroke="rgba(0,0,0,0.05)" className="absolute inset-0 z-10" />}
          {deviceView !== "desktop" && <div className="absolute inset-0 pointer-events-none border-8 border-gray-800 rounded-xl z-20" />}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none relative z-0"
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

    </div>
  );
}
















