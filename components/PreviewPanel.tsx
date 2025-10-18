"use client";

import { useEffect, useRef, useState } from "react";

interface PreviewPanelProps {
  code: string;
}

export default function PreviewPanel({ code }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Generate full HTML document for iframe
  const generateHtml = (bodyContent: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: monospace; 
            margin: 0; 
            padding: 0; 
            min-height: 100vh; 
            background: #ffffff;
          }
          * { 
            box-sizing: border-box; 
          }
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

  const handleRefresh = () => {
    updateIframe(generateHtml(code));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => alert("Code copied to clipboard!"))
      .catch(err => console.error("Failed to copy code:", err));
  };

  const handleFullscreen = () => {
    if (!panelRef.current) return;

    if (!isFullscreen) {
      if (panelRef.current.requestFullscreen) {
        panelRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Button style helper function
  const buttonStyle = (bg: string, disabled = false) => ({
    background: bg,
    color: "#1e1e2e",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontSize: "12px",
    minWidth: "80px",
    transition: "background-color 0.2s",
  });

  return (
    <div
      ref={panelRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'relative',
        backgroundColor: 'var(--panel-bg)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        borderBottom: '1px solid var(--panel-border)',
        flexShrink: 0,
      }}>
        <h2 style={{
          margin: 0,
          color: 'var(--foreground)',
          fontSize: '16px',
          fontWeight: 600,
        }}>
          Preview
        </h2>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleRefresh}
            style={buttonStyle("#89b4fa")}
          >
            Refresh
          </button>
          <button
            onClick={() => setShowEmbed(!showEmbed)}
            style={buttonStyle("#facc15")}
          >
            {showEmbed ? "Close Code" : "Show Code"}
          </button>
          <button
            onClick={handleFullscreen}
            style={buttonStyle("#a6e3a1")}
          >
            {isFullscreen ? "Exit Full" : "Fullscreen"}
          </button>
        </div>
      </div>

      {/* Code Embed Section */}
      {showEmbed && (
        <div style={{
          flexShrink: 0,
          background: '#1e1e2e',
          color: '#ffffff',
          padding: '15px',
          borderBottom: '1px solid var(--panel-border)',
          maxHeight: '200px',
          overflow: 'auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <strong style={{ fontSize: '14px' }}>
              Embed Code
            </strong>
            <button
              onClick={handleCopy}
              style={buttonStyle("#89b4fa")}
            >
              Copy
            </button>
          </div>
          <pre style={{
            margin: 0,
            fontSize: '12px',
            fontFamily: 'monospace',
            background: 'transparent',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.4',
          }}>
            <code>{code}</code>
          </pre>
        </div>
      )}

      {/* Resize Handle */}
      <div
        style={{
          position: 'absolute',
          left: -5,
          top: 0,
          bottom: 0,
          width: 10,
          cursor: 'col-resize',
          zIndex: 10,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
      />

      {/* Preview Content Area */}
      <div style={{
        flex: 1,
        position: 'relative',
        minHeight: 0,
      }}>
        <iframe
          ref={iframeRef}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            backgroundColor: 'white',
          }}
          title="Preview"
        />
        
        {/* Loading Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: 'var(--foreground)',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}>
          Loading...
        </div>
      </div>

      {/* Device Size Controls */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        display: 'flex',
        gap: '5px',
        zIndex: 5,
      }}>
        {['mobile', 'tablet', 'desktop'].map((device) => (
          <button
            key={device}
            onClick={() => {
              // Device view switching logic would go here
              console.log(`Switch to ${device} view`);
            }}
            style={{
              background: 'var(--component-bg)',
              color: 'var(--foreground)',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '3px',
              fontSize: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--component-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--component-bg)';
            }}
          >
            {device}
          </button>
        ))}
      </div>
    </div>
  );
}


