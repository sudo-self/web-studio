"use client";

import { useState, useMemo } from "react";
import Editor from "react-simple-code-editor";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";

interface EditorPanelProps {
  code: string;
  setCode: (val: string) => void;
  runCode: () => void;
  formatCode: () => void;
  onResizeStart?: (e: React.MouseEvent) => void;
  framework: string;
  setFramework: (framework: string) => void;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
}

const highlightCode = (code: string, framework: string) => {
  try {
    if (framework === "react") {
      return Prism.highlight(String(code || ""), Prism.languages.jsx, "jsx");
    } else {
      return Prism.highlight(String(code || ""), Prism.languages.html, "html");
    }
  } catch {
    return String(code || "");
  }
};


const formatReactCode = (code: string): string => {
  try {

    let formatted = code
  
      .replace(/(>)(<)(\w)/g, '$1\n$2$3')
      .replace(/(>)(<)(\/)/g, '$1\n$2$3')
   
      .split('\n')
      .map(line => {
     
        if (line.includes('</') && !line.includes('/>')) {
          return line;
        }
        if (line.trim().startsWith('<') && !line.trim().startsWith('</') && !line.includes('/>')) {
          return '  ' + line;
        }
        return line;
      })
      .join('\n');
    
    return formatted;
  } catch (err) {
    console.error('React formatting error:', err);
    return code;
  }
};

export default function EditorPanel({
  code,
  setCode,
  runCode,
  formatCode,
  onResizeStart,
  framework,
  setFramework,
}: EditorPanelProps) {
  const [formatting, setFormatting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toggleFramework = () => {
    setFramework(framework === "html" ? "react" : "html");
  };

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
      let formatted;
      
      if (framework === "react") {
   
        formatted = formatReactCode(String(code || ""));
      } else {
     
        formatted = await prettier.format(String(code || ""), {
          parser: "html",
          plugins: [parserHtml],
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
        });
      }
      
      setCode(formatted);
      addToast("Code formatted successfully");
    } catch (err) {
      console.error("Formatting failed:", err);
      addToast("Formatting failed. Check your syntax.", "error");
    } finally {
      setFormatting(false);
    }
  };

  const handleClearCode = () => {
    if (window.confirm("Are you sure? this will remove all code.")) {
      setCode("");
      addToast("Editor cleared", "warning");
    }
  };

  const handleExportCode = () => {
    try {
      const fileExtension = framework === "react" ? "jsx" : "html";
      const blob = new Blob([String(code || "")], { type: framework === "react" ? "text/jsx" : "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `component.${fileExtension}`;
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
  
      {onResizeStart && (
        <div
          className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-interactive-accent/20 transition-colors duration-200 rounded"
          onMouseDown={onResizeStart}
        />
      )}

  
      <div className="panel-header">
        <div className="flex items-center gap-3">
   
          {framework === "react" ? (
            <img src="./react.svg" className="w-8 h-8" alt="React" />
          ) : (
            <img src="./html5.svg" className="w-8 h-8" alt="HTML5" />
          )}
          

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFramework}
              className="relative w-16 h-8 rounded-full p-1 transition-colors duration-200 border-2 border-border-primary focus:outline-none focus:ring-2 focus:ring-interactive-accent focus:ring-opacity-50"
              style={{
                backgroundColor: framework === "html" ? "var(--surface-secondary)" : "var(--surface-secondary)"
              }}
            >
            
              <div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-200 flex items-center justify-center"
                style={{
                  left: framework === "html" ? "4px" : "36px"
                }}
              >
             
                {framework === "html" ? (
                  <img src="./html5.svg" className="w-3 h-3" alt="HTML5" />
                ) : (
                  <img src="./react.svg" className="w-3 h-3" alt="React" />
                )}
              </div>
            </button>

       
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold tracking-tight">
                {framework === "react" ? "React" : "HTML"}
              </span>
              <span className="text-xs text-text-tertiary">
                {framework === "react" ? "JSX" : "HTML5"}
              </span>
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
                Format
              </div>
            )}
          </button>

          <button className="btn btn-outline btn-sm" onClick={handleCopyCode}>
            <div className="flex items-center gap-2">
              Copy
            </div>
          </button>

          <button className="btn btn-outline btn-sm" onClick={handleExportCode}>
            <div className="flex items-center gap-2">
              Export
            </div>
          </button>

          <button className="btn btn-danger btn-sm" onClick={handleClearCode}>
            <div className="flex items-center gap-2">
              Clear
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-auto bg-surface-primary rounded-lg border border-border-primary">
      
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


        <div className="flex-1 relative">
          <Editor
            value={String(code || "")}
            onValueChange={(val) => setCode(String(val))}
            highlight={(code) => highlightCode(code, framework)}
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

     
      <div className="flex justify-between items-center px-4 py-2 text-xs text-text-tertiary border-t border-border-primary bg-surface-secondary rounded-b-lg mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{characterCount} {characterCount === 1 ? 'character' : 'characters'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{framework === "react" ? "JSX" : "HTML"}</span>
        </div>
      </div>

 
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
          fontSize: 14px !important;
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

  
/* syntax highlighting */ 

.token.comment { color: #6a737d; }
.token.punctuation { color: var(--text-primary); }
.token.tag { color: #e06c75; }
.token.attr-name { color: #d19a66; }
.token.attr-value { color: rgb(6, 182, 212); } 
.token.keyword { color: #d73a49; }
.token.function { color: #6f42c1; }
.token.selector { color: #32a852; }
.token.property { color: rgb(6, 182, 212); }
.token.string { color: rgb(6, 182, 212); } 
.token.operator { color: #d73a49; }
.token.number { color: rgb(6, 182, 212); }
.token.boolean { color: #d73a49; }
      `}</style>
    </div>
  );
}






