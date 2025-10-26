"use client";

import { useEffect, useRef, useState } from "react";
import { GridPattern } from "./GridPattern";
import { Smartphone, Tablet, Monitor, Wand2, Image as ImageIcon, Download, Package } from "lucide-react";

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
  const [iframeKey, setIframeKey] = useState(0);
  const [showImageGen, setShowImageGen] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showIconPack, setShowIconPack] = useState(false);

  const generateHtml = (content: string, currentFramework: string) => {
    if (currentFramework === "react") {
      const reactCode = content.trim();
      
      if (!reactCode) {
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>React Preview</title>
            <style>
              body { margin: 0; font-family: system-ui; background: #f8fafc; }
              #root { padding: 20px; display: flex; align-items: center; justify-content: center; min-height: 100vh; color: #64748b; }
            </style>
          </head>
          <body>
            <div id="root">Ready for React code</div>
          </body>
          </html>
        `;
      }

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>React Preview</title>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone@7.23.5/babel.min.js"></script>
          <style>
            body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
            #root { min-height: 100vh; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel" data-type="module">
            const { useState, useEffect, useRef } = React;
            
            try {
              const UserComponent = (() => {
                ${reactCode}
                
                if (typeof App !== 'undefined') return App;
                if (typeof Component !== 'undefined') return Component;
                if (typeof Default !== 'undefined') return Default;
                
                return () => {
                  try {
                    ${reactCode.includes('return') ? '' : 'return (' + reactCode + ')'}
                  } catch (e) {
                    return React.createElement('div', {style: {color: 'red', padding: '20px'}}, 
                      'Error rendering component: ' + e.message);
                  }
                };
              })();
              
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(UserComponent));
              
            } catch (error) {
              console.error('React Error:', error);
              document.getElementById('root').innerHTML = 
                '<div style="color: red; padding: 20px; font-family: monospace;">' +
                '<h3>React Error:</h3>' +
                '<pre>' + error.message + '</pre>' +
                '<p style="color: #666; font-size: 14px;">Check your component syntax and exports.</p>' +
                '</div>';
            }
          </script>
        </body>
        </html>
      `;
    }

    const htmlContent = content.trim() || '<div style="padding: 20px;">Ready for HTML code</div>';
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; }
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>
    `;
  };

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const updateIframe = () => {
    if (iframeRef.current) {
      const html = generateHtml(code, framework);
      iframeRef.current.srcdoc = html;
    }
  };

  useEffect(() => {
    updateIframe();
  }, [code, framework]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIframeKey(prev => prev + 1);
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

  const handleCopyHTMLTags = async () => {
    const htmlTags = `<!-- Add these tags in your <head> section -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">
<link rel="icon" type="image/svg+xml" href="/icon.svg">`;
    
    try {
      await navigator.clipboard.writeText(htmlTags);
      addToast("HTML tags copied to clipboard!");
    } catch {
      addToast("Failed to copy HTML tags", "error");
    }
  };

  const handleFullscreen = () => {
    if (!panelRef.current) return;
    if (!isFullscreen) {
      panelRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      addToast("Please enter a prompt", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("https://text-to-image.jessejesse.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      addToast("Image generated successfully!");
    } catch (error) {
      addToast("Failed to generate image", "error");
      console.error("Image generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `ai-image-${Date.now()}.png`;
    link.click();
    addToast("Image downloaded!");
  };

  const insertImageIntoCode = () => {
    if (!generatedImage) return;
    addToast("Image URL ready to use!", "success");
  };

  const downloadIconPack = () => {
    if (!generatedImage) {
      addToast("Generate an image first", "error");
      return;
    }
    addToast("Icon pack download started!");
    // In a real implementation, you would generate multiple sizes and zip them
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `icon-pack-${Date.now()}.png`;
    link.click();
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
          className="absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-interactive-accent/20 rounded"
          onMouseDown={onResizeStart}
        />
      )}

      <div className="panel-header flex justify-between items-center p-4 border-b border-border-primary bg-surface-secondary">
        <div className="flex items-center gap-3">
          {framework === "react" ? (
            <img src="./react.svg" className="w-6 h-6" alt="React" />
          ) : (
            <img src="./html5.svg" className="w-6 h-6" alt="HTML5" />
          )}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-text-primary">Web Studio</h2>
            <span className="text-xs text-text-tertiary">studio.jessejesse.com</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            className={`btn btn-sm ${showImageGen ? "btn-accent" : "btn-outline"} flex items-center gap-2`}
            onClick={() => setShowImageGen(!showImageGen)}
          >
            <Wand2 className="w-4 h-4" />
            AI Image
          </button>
          <button
            className={`btn btn-sm ${showIconPack ? "btn-accent" : "btn-outline"} flex items-center gap-2`}
            onClick={() => setShowIconPack(!showIconPack)}
          >
            <Package className="w-4 h-4" />
            Icon Pack
          </button>
          <button
            className={`btn btn-sm ${showEmbed ? "btn-accent" : "btn-outline"}`}
            onClick={() => setShowEmbed(!showEmbed)}
          >
            {showEmbed ? "Hide Code" : "Show Code"}
          </button>
          <button
            className={`btn btn-sm ${isFullscreen ? "btn-warning" : "btn-outline"}`}
            onClick={handleFullscreen}
          >
            {isFullscreen ? "Exit Full" : "Fullscreen"}
          </button>
          <button
            className={`btn btn-sm ${showGrid ? "btn-accent" : "btn-outline"}`}
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? "Hide Grid" : "Show Grid"}
          </button>
        </div>
      </div>

      {showImageGen && (
        <div className="bg-surface-primary border-b border-border-primary p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-2">
                <img src="./workers.svg" className="w-6 h-6" alt="Cloudflare Workers" />
                <span className="text-xs text-text-tertiary bg-surface-tertiary px-2 py-0.5 rounded">
                  stabilityai/stable-diffusion-xl-base-1.0
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && generateImage()}
                  placeholder="Describe the image you want to generate..."
                  className="flex-1 px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-interactive-accent bg-surface-primary text-text-primary placeholder-text-tertiary"
                />
                <button
                  onClick={generateImage}
                  disabled={isGenerating}
                  className="btn btn-accent"
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
              {generatedImage && (
                <div className="flex gap-3 p-4 bg-surface-tertiary rounded-lg">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-32 h-32 object-cover rounded-lg shadow-md border border-border-primary"
                  />
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <p className="text-sm text-text-secondary">Image generated successfully!</p>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadImage}
                        className="btn btn-success btn-sm"
                      >
                        Download
                      </button>
                      <button
                        onClick={insertImageIntoCode}
                        className="btn btn-outline btn-sm"
                      >
                        Use in Code
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showIconPack && generatedImage && (
        <div className="bg-surface-primary border-b border-border-primary p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-interactive-accent" />
                  <h3 className="font-semibold text-text-primary">Icon Pack Generator</h3>
                </div>
                <span className="text-xs text-text-tertiary bg-surface-tertiary px-2 py-0.5 rounded">
                  Includes 10+ HQ icons & SVG
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-surface-tertiary rounded-lg">
                {[16, 32, 64, 128].map((size) => (
                  <div key={size} className="flex flex-col items-center">
                    <div className="bg-white p-2 rounded border border-border-primary">
                      <img
                        src={generatedImage}
                        width={size}
                        height={size}
                        alt={`${size}px icon`}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs text-text-tertiary mt-1">{size}px</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-text-primary">HTML Head Tags</h4>
                <div className="bg-surface-tertiary p-3 rounded-lg">
                  <pre className="text-xs font-mono text-text-primary whitespace-pre-wrap">
{`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">
<link rel="icon" type="image/svg+xml" href="/icon.svg">`}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyHTMLTags}
                    className="btn btn-success btn-sm"
                  >
                    Copy HTML Tags
                  </button>
                  <button
                    onClick={downloadIconPack}
                    className="btn btn-accent btn-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Icon Pack
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEmbed && (
        <div className="bg-surface-primary border border-border-primary rounded-lg m-4 overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-border-primary bg-surface-secondary">
            <span className="font-semibold text-sm text-text-primary">Component Code</span>
            <button className="btn btn-success btn-sm" onClick={handleCopy}>
              Copy Code
            </button>
          </div>
          <div className="p-4 max-h-48 overflow-auto bg-surface-tertiary">
            <pre className="text-sm font-mono text-text-primary whitespace-pre-wrap leading-6">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}

      <div className="flex-1 relative flex justify-center items-start p-4 bg-surface-secondary overflow-auto">
        <div
          className="shadow-xl transition-all duration-500 bg-white rounded-xl overflow-hidden border border-border-primary relative"
          style={{
            width: deviceSizes[deviceView].width,
            height: deviceSizes[deviceView].height,
          }}
        >
          {showGrid && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <GridPattern
                width={40}
                height={40}
                className="opacity-30"
                stroke="rgba(0,0,0,0.1)"
              />
            </div>
          )}
          
          {deviceView !== "desktop" && (
            <div className="absolute inset-0 pointer-events-none border-8 border-gray-800 rounded-xl z-20" />
          )}
          
          <iframe
            key={iframeKey}
            ref={iframeRef}
            className="w-full h-full border-none bg-white relative z-0"
            title="Live Preview"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 p-3 border-t border-border-primary bg-surface-secondary">
        {(["mobile", "tablet", "desktop"] as const).map(device => {
          const Icon = deviceIcons[device];
          const active = deviceView === device;
          return (
            <button
              key={device}
              onClick={() => setDeviceView(device)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                active
                  ? "bg-interactive-accent text-white"
                  : "bg-surface-primary text-text-primary hover:bg-surface-tertiary"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="capitalize">{device}</span>
            </button>
          );
        })}
      </div>

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
              toast.type === "success"
                ? "bg-green-100 border-green-300 text-green-700"
                : "bg-red-100 border-red-300 text-red-700"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`} />
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-current hover:opacity-70 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


