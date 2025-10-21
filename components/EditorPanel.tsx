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

  const handleRunCode = () => runCode();

  const handleFormatCode = async () => {
    try {
      setFormatting(true);
    
      const formatted = await prettier.format(String(code || ""), {
        parser: "html",
        plugins: [parserHtml],
      });
      setCode(formatted);
    } catch (err) {
      console.error("Formatting failed:", err);
      alert("Formatting failed. Check your HTML syntax.");
    } finally {
      setFormatting(false);
    }
  };

  const handleClearCode = () => {
    if (confirm("Are you sure you want to clear the editor?")) setCode("");
  };

  const handleExportCode = () => {
    const blob = new Blob([String(code || "")], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(String(code || ""))
      .then(() => alert("Code copied to clipboard!"))
      .catch(console.error);
  };

  const lineNumbers = useMemo(() => {
    const totalLines = String(code || "").split("\n").length;
    return Array.from({ length: totalLines }, (_, i) => i + 1);
  }, [code]);

  return (
    <div className="flex flex-col h-full bg-panel-bg text-foreground rounded-lg overflow-hidden relative">
      {onResizeStart && (
        <div
          className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-accent-color hover:bg-opacity-50 transition-colors"
          onMouseDown={onResizeStart}
        />
      )}

      {/* Header */}
      <div className="panel-header flex justify-between items-center gap-2 flex-wrap p-3 border-b border-panel-border bg-panel-header">
        <h2 className="m-0 text-sm font-semibold">HTML</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            className="btn btn-secondary"
            onClick={handleFormatCode}
            disabled={formatting}
          >
            {formatting ? "Formatting..." : "Format"}
          </button>
          <button className="btn btn-secondary" onClick={handleCopyCode}>
            Copy
          </button>
          <button className="btn btn-secondary" onClick={handleExportCode}>
            Export
          </button>
            <button className="btn btn-danger" onClick={handleClearCode}>
            Clear
          </button>
        </div>
      </div>

      {/* Editor with line numbers */}
      <div className="flex flex-1 overflow-auto">
        <div className="bg-panel-header text-gray-400 text-right pr-3 select-none pt-[15px] border-r border-panel-border">
          {lineNumbers.map((line) => (
            <div
              key={line}
              style={{ height: "1.5em", lineHeight: "1.5em", fontSize: 14 }}
            >
              {line}
            </div>
          ))}
        </div>

        <div className="flex-1">
          <Editor
            value={String(code || "")}
            onValueChange={(val) => setCode(String(val))}
            highlight={highlightCode}
            padding={15}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              backgroundColor: "var(--panel-bg)",
              color: "var(--foreground)",
              minHeight: "100%",
              lineHeight: 1.5,
              flex: 1,
            }}
            textareaClassName="editor-textarea"
            preClassName="editor-pre"
          />
        </div>
      </div>

      <style jsx global>{`
        .editor-pre,
        .editor-textarea {
          margin: 0 !important;
          padding: 15px !important;
          font-family: "Fira Code", monospace !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          white-space: pre !important;
          word-wrap: normal !important;
          overflow-wrap: normal !important;
          tab-size: 2 !important;
        }

        .editor-pre {
          background: var(--panel-bg) !important;
          color: var(--foreground) !important;
        }

        .editor-textarea {
          outline: none !important;
          caret-color: var(--foreground) !important;
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
          caret-color: var(--foreground) !important;
          animation: cursor-blink 1.2s steps(2, start) infinite !important;
        }

        .react-simple-code-editor pre {
          margin: 0 !important;
          padding: 15px !important;
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

        /* Prism tokens */
        .token.comment { color: #6a737d; }
        .token.punctuation { color: var(--foreground); }
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






