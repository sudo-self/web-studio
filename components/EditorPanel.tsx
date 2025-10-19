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
  onResizeStart?: (e: React.MouseEvent) => void;
}

const highlightCode = (code: string) => {
  try {
    return Prism.highlight(code || "", Prism.languages.html, "html");
  } catch {
    return code || "";
  }
};

export default function EditorPanel({
  code,
  setCode,
  runCode,
  onResizeStart,
}: EditorPanelProps) {
  const [formatting, setFormatting] = useState(false);

  const handleFormatCode = async () => {
    try {
      setFormatting(true);
      const formatted = prettier.format(code || "", {
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
    const blob = new Blob([code || ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(code || "")
      .then(() => alert("Code copied to clipboard!"))
      .catch(console.error);
  };

  const lineNumbers = useMemo(() => {
    return (code || "").split("\n").map((_, i) => i + 1);
  }, [code]);

  return (
    <div className="flex flex-col h-full bg-panel-bg text-foreground rounded-lg overflow-hidden relative">
      {/* Resize Handle */}
      {onResizeStart && (
        <div
          className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-accent-color hover:bg-opacity-50 transition-colors"
          onMouseDown={onResizeStart}
        />
      )}

      {/* Header */}
      <div className="panel-header flex justify-between items-center gap-2 flex-wrap p-3 border-b border-panel-border bg-panel-header">
        <h2 className="m-0 text-sm font-semibold">Code Editor</h2>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-primary" onClick={runCode}>
            Run
          </button>
          <button
            className="btn btn-success"
            onClick={handleFormatCode}
            disabled={formatting}
          >
            {formatting ? "Formatting..." : "Format"}
          </button>
          <button className="btn btn-secondary" onClick={handleCopyCode}>
            Copy
          </button>
          <button className="btn btn-danger" onClick={handleClearCode}>
            Clear
          </button>
          <button className="btn btn-warning" onClick={handleExportCode}>
            Export
          </button>
        </div>
      </div>

      {/* Editor with line numbers */}
      <div className="flex flex-1 overflow-auto">
        {/* Line numbers gutter */}
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

        {/* Code editor */}
        <div className="flex-1">
          <Editor
            value={code || ""}
            onValueChange={setCode}
            highlight={highlightCode}
            padding={15}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              backgroundColor: "var(--panel-bg)",
              color: "var(--foreground)",
              minHeight: "100%",
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        .react-simple-code-editor textarea {
          outline: none !important;
          border: none !important;
          background: transparent !important;
          caret-color: var(--foreground) !important;
          font-family: "Fira Code", monospace !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }
        .react-simple-code-editor pre {
          margin: 0 !important;
          padding: 15px !important;
        }
        /* Prism tokens */
        .token.comment {
          color: #6a737d;
        }
        .token.punctuation {
          color: var(--foreground);
        }
        .token.tag {
          color: #e06c75;
        }
        .token.attr-name {
          color: #d19a66;
        }
        .token.attr-value {
          color: #98c379;
        }
        .token.keyword {
          color: #d73a49;
        }
        .token.function {
          color: #6f42c1;
        }
        .token.selector {
          color: #32a852;
        }
        .token.property {
          color: #22863a;
        }
      `}</style>
    </div>
  );
}





