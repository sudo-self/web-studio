"use client";

import { useEffect, useRef } from "react";

export default function PreviewPanel({ code }: { code: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = `
        <!DOCTYPE html>
        <html>
          <head><style>body { font-family: sans-serif; padding: 1rem; }</style></head>
          <body>${code}</body>
        </html>
      `;
    }
  }, [code]);

  return (
    <div className="panel preview-panel">
      <div className="panel-header">
        <h2>Preview</h2>
      </div>
      <div className="preview-container">
        <iframe ref={iframeRef}></iframe>
      </div>
    </div>
  );
}

