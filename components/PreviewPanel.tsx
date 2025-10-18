"use client";

import { useEffect, useRef } from "react";

interface PreviewPanelProps {
  code: string;
}

export default function PreviewPanel({ code }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const htmlDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
                min-height: 100vh;
              }
              * {
                box-sizing: border-box;
              }
            </style>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>${code}</body>
        </html>
      `;
      iframeRef.current.srcdoc = htmlDoc;
    }
  }, [code]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      const htmlDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
                min-height: 100vh;
              }
            </style>
          </head>
          <body>${code}</body>
        </html>
      `;
      iframeRef.current.srcdoc = htmlDoc;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%' 
    }}>
      <div className="panel-header">
        <h2>Preview</h2>
        <button
          onClick={handleRefresh}
          style={{
            background: '#89b4fa',
            color: '#1e1e2e',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          Refresh
        </button>
      </div>
      
      <div className="preview-container">
        <iframe
          ref={iframeRef}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          title="Preview"
        />
      </div>
    </div>
  );
}

