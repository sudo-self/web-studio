// /components/EditorPanel.tsx

"use client";

import { useState, useMemo } from "react";
import Editor from "react-simple-code-editor";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";

interface EditorPanelProps {
  code: string;
  setCode: (val: string) => void;
  runCode: () => void;
  formatCode: () => void;
  onResizeStart?: (e: React.MouseEvent) => void;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
}

const highlightCode = (code: string) => {
  try {
    return Prism.highlight(String(code || ""), Prism.languages.html, "html");
  } catch {
    return String(code || "");
  }
};

export default function EditorPanel({
  code,
  setCode,
  runCode,
  formatCode,
  onResizeStart,
}: EditorPanelProps) {
  const [formatting, setFormatting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error" | "warning" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const handleRunCode = () => {
    runCode();
    addToast("Code executed successfully");
  };

  const handleFormatCode = async () => {
    try {
      setFormatting(true);
      const formatted = await prettier.format(String(code || ""), {
        parser: "html",
        plugins: [parserHtml],
      });
      setCode(formatted);
      addToast("Code formatted successfully");
    } catch (err) {
      console.error("Formatting failed:", err);
      addToast("Formatting failed. Check your HTML syntax.", "error");
    } finally {
      setFormatting(false);
    }
  };

  const handleClearCode = () => {
    if (window.confirm("Are you sure you want to clear the editor?")) {
      setCode("");
      addToast("Editor cleared", "warning");
    }
  };

  const handleExportCode = () => {
    try {
      const blob = new Blob([String(code || "")], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "component.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast("Code exported successfully");
    } catch (err) {
      addToast("Export failed", "error");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(String(code || ""));
      addToast("Code copied to clipboard!");
    } catch (err) {
      addToast("Failed to copy code", "error");
      console.error("Copy failed:", err);
    }
  };

  const lineNumbers = useMemo(() => {
    const totalLines = String(code || "").split("\n").length;
    return Array.from({ length: totalLines }, (_, i) => i + 1);
  }, [code]);

  const characterCount = String(code || "").length;
  const lineCount = String(code || "").split("\n").length;

  return (
    <div className="panel editor-panel relative">
      {/* Resize Handle */}
      {onResizeStart && (
        <div
          className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-interactive-accent/20 transition-colors duration-200 rounded"
          onMouseDown={onResizeStart}
        />
      )}

      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-interactive-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h2 className="text-lg font-semibold tracking-tight">HTML Editor</h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {lineCount} lines
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {characterCount} chars
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            className={`btn ${formatting ? 'btn-secondary loading' : 'btn-outline'} btn-sm`}
            onClick={handleFormatCode}
            disabled={formatting}
          >
            {formatting ? (
              "Formatting..."
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Format
              </div>
            )}
          </button>

          <button className="btn btn-outline btn-sm" onClick={handleCopyCode}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </div>
          </button>

          <button className="btn btn-outline btn-sm" onClick={handleExportCode}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Export
            </div>
          </button>

          <button className="btn btn-danger btn-sm" onClick={handleClearCode}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </div>
          </button>
        </div>
      </div>

      {/* Editor with line numbers */}
      <div className="flex flex-1 overflow-auto bg-surface-primary rounded-lg border border-border-primary">
        {/* Line Numbers */}
        <div className="bg-surface-secondary text-text-tertiary text-right pr-4 pl-3 py-4 select-none border-r border-border-primary font-mono text-sm">
          {lineNumbers.map((line) => (
            <div
              key={line}
              className="h-6 leading-6 hover:text-text-secondary transition-colors"
              style={{ lineHeight: "1.5em" }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative">
          <Editor
            value={String(code || "")}
            onValueChange={(val) => setCode(String(val))}
            highlight={highlightCode}
            padding={16}
            style={{
              fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',
              fontSize: 14,
              backgroundColor: "var(--surface-primary)",
              color: "var(--text-primary)",
              minHeight: "100%",
              lineHeight: 1.5,
              flex: 1,
            }}
            textareaClassName="editor-textarea"
            preClassName="editor-pre"
          />
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transform transition-all duration-300 animate-in slide-in-from-right-8 ${
              toast.type === "success" 
                ? "bg-interactive-success/10 border-interactive-success/20 text-interactive-success" 
                : toast.type === "error"
                ? "bg-interactive-danger/10 border-interactive-danger/20 text-interactive-danger"
                : "bg-interactive-warning/10 border-interactive-warning/20 text-interactive-warning"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              toast.type === "success" 
                ? "bg-interactive-success" 
                : toast.type === "error"
                ? "bg-interactive-danger"
                : "bg-interactive-warning"
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

      <style jsx global>{`
        .editor-pre,
        .editor-textarea {
          margin: 0 !important;
          padding: 16px !important;
          font-family: "Fira Code", "JetBrains Mono", "Cascadia Code", monospace !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          white-space: pre !important;
          word-wrap: normal !important;
          overflow-wrap: normal !important;
          tab-size: 2 !important;
        }

        .editor-pre {
          background: var(--surface-primary) !important;
          color: var(--text-primary) !important;
        }

        .editor-textarea {
          outline: none !important;
          caret-color: var(--interactive-accent) !important;
          background: transparent !important;
          border: none !important;
          resize: none !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }

        .react-simple-code-editor {
          position: relative !important;
          overflow: auto !important;
          min-height: 100% !important;
        }

        .react-simple-code-editor textarea {
          outline: none !important;
          border: none !important;
          background: transparent !important;
          caret-color: var(--interactive-accent) !important;
          animation: cursor-blink 1.2s steps(2, start) infinite !important;
        }

        .react-simple-code-editor pre {
          margin: 0 !important;
          padding: 16px !important;
          pointer-events: none !important;
          overflow: hidden !important;
        }

        @keyframes cursor-blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

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

        /* Prism tokens - Left unchanged as requested */
        .token.comment { color: #6a737d; }
        .token.punctuation { color: var(--text-primary); }
        .token.tag { color: #e06c75; }
        .token.attr-name { color: #d19a66; }
        .token.attr-value { color: #98c379; }
        .token.keyword { color: #d73a49; }
        .token.function { color: #6f42c1; }
        .token.selector { color: #32a852; }
        .token.property { color: #22863a; }
      `}</style>
    </div>
  );
}






