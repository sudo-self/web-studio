"use client";

import { useEffect, useRef, useState } from "react";
import { GridPattern } from "./GridPattern";
import { Smartphone, Tablet, Moon, Zap, Monitor, Wand2, Image as ImageIcon, Download, Package } from "lucide-react";

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

interface IconSize {
  size: number;
  name: string;
  fileName: string;
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

  const iconSizes: IconSize[] = [
    { size: 16, name: "Favicon", fileName: "favicon.ico" },
    { size: 32, name: "Small", fileName: "icon-32x32.png" },
    { size: 64, name: "Medium", fileName: "icon-64x64.png" },
    { size: 128, name: "Large", fileName: "icon-128x128.png" },
    { size: 180, name: "Apple Touch", fileName: "apple-touch-icon.png" },
    { size: 192, name: "Android", fileName: "android-chrome-192x192.png" },
    { size: 512, name: "Large Android", fileName: "android-chrome-512x512.png" },
  ];

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

    const generateImage = async (promptOverride?: string) => {
      const finalPrompt = promptOverride || imagePrompt;
      
      if (!finalPrompt.trim()) {
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
          body: JSON.stringify({ prompt: finalPrompt }),
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
      link.download = `web-studio-${Date.now()}.png`;
      link.click();
      addToast("Image downloaded!");
    };

    const insertImageIntoCode = () => {
      if (!generatedImage) return;
      addToast("Image URL ready to use!", "success");
    };

    const resizeImage = async (imageUrl: string, width: number, height: number): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = width;
          canvas.height = height;
          
          ctx!.imageSmoothingEnabled = true;
          ctx!.imageSmoothingQuality = 'high';
          ctx!.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png', 1.0);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });
    };

    const downloadIconPack = async () => {
      if (!generatedImage) {
        addToast("Generate an image first", "error");
        return;
      }

      try {
        addToast("Creating icon pack...");
        
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        

        const iconsFolder = zip.folder("icons");
        
        if (!iconsFolder) {
          throw new Error('Failed to create icons folder');
        }

     
        for (const iconSize of iconSizes) {
          try {
            const resizedBlob = await resizeImage(generatedImage, iconSize.size, iconSize.size);
            iconsFolder.file(iconSize.fileName, resizedBlob);
          } catch (error) {
            console.error(`Failed to resize image to ${iconSize.size}px:`, error);
          }
        }

   
        const createSvgBlob = async (): Promise<Blob> => {
          return new Promise(async (resolve, reject) => {
            try {
         
              const response = await fetch(generatedImage);
              const blob = await response.blob();
              const reader = new FileReader();
              
              reader.onload = () => {
                const base64data = reader.result as string;
                
              
                const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <clipPath id="circleClip">
          <circle cx="256" cy="256" r="256"/>
        </clipPath>
      </defs>
      <image x="0" y="0" width="512" height="512" xlink:href="${base64data}" clip-path="url(#circleClip)"/>
    </svg>`;
                
                const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
                resolve(svgBlob);
              };
              
              reader.onerror = () => reject(new Error('Failed to read image for SVG'));
              reader.readAsDataURL(blob);
            } catch (error) {
              reject(error);
            }
          });
        };

        // SVG
        try {
          const svgBlob = await createSvgBlob();
          iconsFolder.file("icon.svg", svgBlob);
        } catch (error) {
          console.error("Failed to create SVG:", error);
        
          const fallbackSvg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#4f46e5"/>
      <circle cx="256" cy="256" r="128" fill="#ffffff" opacity="0.9"/>
      <text x="256" y="256" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="48" fill="#4f46e5" font-weight="bold">Icon</text>
    </svg>`;
          iconsFolder.file("icon.svg", fallbackSvg);
        }

      
        const createIcoFile = async (): Promise<Blob> => {
          try {
        
            const faviconBlob = await resizeImage(generatedImage, 32, 32);
            return faviconBlob;
          } catch (error) {
            console.error("Failed to create ICO, using PNG fallback:", error);
          
            return await resizeImage(generatedImage, 32, 32);
          }
        };

        // ico
        try {
          const icoBlob = await createIcoFile();
          iconsFolder.file("favicon.ico", icoBlob);
        } catch (error) {
          console.error("Failed to create ICO file:", error);
        }

        // tags
        const htmlTags = `<!-- Add these tags in your <head> section -->
    <link rel="icon" href="/icons/favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png">
    <link rel="icon" type="image/svg+xml" href="/icons/icon.svg">
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/icons/android-chrome-512x512.png">
    <meta name="theme-color" content="#ffffff">`;
        
        zip.file("html-tags.html", htmlTags);

        // README
        const readme = `# Web Studio Icon Pack

    This pack contains all the necessary icons for your website:

    ## Included Files:
    ${iconSizes.map(icon => `- ${icon.fileName} (${icon.size}x${icon.size}px) - ${icon.name}`).join('\n')}
    - icon.svg (Scalable vector version with embedded image)

    ## Usage:
    1. Extract the zip file
    2. Place the "icons" folder in your project's public directory
    3. Copy the HTML tags from html-tags.html into your <head> section
    4. Update paths if needed

  
    Generated with Web Studio - studio.jessejesse.com`;
        
        zip.file("README.md", readme);

      
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `icon-pack-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addToast("Icon pack downloaded successfully!");
      } catch (error) {
        console.error("Icon pack generation error:", error);
        addToast("Failed to create icon pack", "error");
      }
    };

   
    const generateWithStyle = (style: string) => {
      const basePrompt = imagePrompt.trim();
      const fullPrompt = basePrompt ? `${basePrompt}, ${style}` : style;
      generateImage(fullPrompt);
    };

  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

    const deviceSizes = {
      mobile: { width: "min(375px, 95vw)", height: "min(667px, 90vh)" },
      tablet: { width: "min(768px, 95vw)", height: "min(1024px, 95vh)" },
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
        <div className="flex flex-col gap-2">
          {/* First row of buttons */}
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-outline btn-sm px-4 py-2"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              className={`btn btn-sm px-4 py-2 ${showEmbed ? "btn-accent" : "btn-outline"}`}
              onClick={() => setShowEmbed(!showEmbed)}
            >
              {showEmbed ? "Hide Code" : "Show Code"}
            </button>
            <button
              className={`btn btn-sm px-4 py-2 ${isFullscreen ? "btn-warning" : "btn-outline"}`}
              onClick={handleFullscreen}
            >
              {isFullscreen ? "Exit Full" : "Fullscreen"}
            </button>
          </div>
          {/* Second row of buttons */}
          <div className="flex gap-2 justify-end">
            <button
              className={`btn btn-sm px-4 py-2 ${showGrid ? "btn-accent" : "btn-outline"}`}
              onClick={() => setShowGrid(!showGrid)}
            >
              {showGrid ? "Hide Grid" : "Show Grid"}
            </button>
          <button
            className={`btn btn-sm px-4 py-2 flex items-center gap-2 ${
              showImageGen
                ? framework === "react"
                  ? "bg-cyan-500 text-white hover:bg-cyan-600"
                  : "bg-orange-500 text-white hover:bg-orange-600"
                : "btn-outline"
            }`}
            onClick={() => setShowImageGen(!showImageGen)}
          >
            {framework === "react" ? (
              <img src="./react.svg" className="w-4 h-4" alt="React" />
            ) : (
              <img src="./html5.svg" className="w-4 h-4" alt="HTML5" />
            )}
            {showImageGen ? "Hide AI" : "AI Image"}
          </button>

            <button
              className={`btn btn-sm px-4 py-2 ${showIconPack ? "btn-accent" : "btn-outline"}`}
              onClick={() => setShowIconPack(!showIconPack)}
            >
              Icons
            </button>
          </div>
        </div>
      </div>

          {showImageGen && (
            <div className="bg-surface-primary border-b border-border-primary p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="./workers.svg" className="w-5 h-5" alt="Cloudflare Workers" />
                      <span className="text-xs text-text-tertiary bg-surface-tertiary px-2 py-0.5 rounded">
                        stabilityai/stable-diffusion-xl-base-1.0
                      </span>
                    </div>
                  </div>

                  {/* Prompt input */}
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
                      onClick={() => generateImage()}
                      disabled={isGenerating}
                      className="btn btn-accent px-4 py-2"
                    >
                      {isGenerating ? "Generating..." : "Generate"}
                    </button>
                  </div>

                  {/* Style prompt buttons */}
                  <div className="flex gap-2">
                    {[
                      { label: "Cartoon", value: "cartoon style", icon: <ImageIcon className="w-4 h-4" /> },
                      { label: "B&W", value: "black and white", icon: <Moon className="w-4 h-4" /> },
                      { label: "Neon", value: "neon colors", icon: <Zap className="w-4 h-4" /> },
                    ].map((prompt) => (
                      <button
                        key={prompt.value}
                        onClick={() => generateWithStyle(prompt.value)}
                        disabled={isGenerating}
                        className="
                          btn btn-outline btn-sm flex items-center gap-1 px-3 py-1.5 text-xs
                          transition-all duration-200
                          hover:text-cyan-400 hover:border-cyan-400
                          hover:shadow-[0_0_8px_rgba(6,182,212,0.6)]
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        {prompt.icon}
                        {prompt.label}
                      </button>
                    ))}
                  </div>

                  {/* Generated image display */}
                  {generatedImage && (
                    <div className="flex gap-3 p-4 bg-surface-tertiary rounded-lg">
                      <img
                        src={generatedImage}
                        alt="Generated"
                        className="w-32 h-32 object-cover rounded-lg shadow-md border border-border-primary"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-text-secondary mb-3">
                            Image generated successfully!
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={downloadImage}
                              className="btn btn-success btn-sm px-3 py-1.5"
                            >
                              Download Image
                            </button>
                            <button
                              onClick={insertImageIntoCode}
                              className="btn btn-outline btn-sm px-3 py-1.5"
                            >
                              Use in Code
                            </button>
                            <button
                              onClick={() => setShowIconPack(true)}
                              className="btn btn-accent btn-sm px-3 py-1.5"
                            >
                              Create Icon Pack
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


      {showIconPack && generatedImage && (
        <div className="bg-surface-primary border-b border-border-primary p-4 overflow-auto max-h-64">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-interactive-accent" />
                  <h3 className="font-semibold text-text-primary">Icon Pack</h3>
                </div>
                <span className="text-xs text-text-tertiary bg-surface-tertiary px-2 py-0.5 rounded">
                  7 icons + Scalable Vector Graphic
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-surface-tertiary rounded-lg">
                {iconSizes.map((iconSize) => (
                  <div key={iconSize.size} className="flex flex-col items-center">
                    <div className="bg-white p-2 rounded border border-border-primary shadow-sm">
                      <img
                        src={generatedImage}
                        width={Math.min(iconSize.size, 64)}
                        height={Math.min(iconSize.size, 64)}
                        alt={`${iconSize.size}px icon`}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs text-text-tertiary mt-1">{iconSize.size}px</span>
                    <span className="text-xs text-text-secondary">{iconSize.name}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-text-primary">HTML Head Tags</h4>
                <div className="bg-surface-tertiary p-3 rounded-lg overflow-auto">
                  <pre className="text-xs font-mono text-text-primary whitespace-pre-wrap">
{`<link rel="icon" href="/icons/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png">
<link rel="icon" type="image/svg+xml" href="/icons/icon.svg">
<link rel="icon" type="image/png" sizes="192x192" href="/icons/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/icons/android-chrome-512x512.png">`}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyHTMLTags}
                    className="btn btn-success btn-sm px-3 py-1.5"
                  >
                    Copy HTML Tags
                  </button>
                  <button
                    onClick={downloadIconPack}
                    className="btn btn-accent btn-sm px-3 py-1.5"
                  >
                    Download Icon Pack (.zip)
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
            <button className="btn btn-success btn-sm px-3 py-1.5" onClick={handleCopy}>
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

      <div className="flex-1 relative flex justify-center items-center p-4 bg-surface-secondary overflow-auto">
          <div
            className="shadow-xl transition-all duration-500 bg-white rounded-xl overflow-hidden border border-border-primary relative"
            style={{
              width: deviceSizes[deviceView].width,
              height: deviceSizes[deviceView].height,
              maxWidth: deviceView === "desktop" ? "100%" : "none",
              maxHeight: deviceView === "desktop" ? "100%" : "none",
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
