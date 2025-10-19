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

export default function EditorPanel({ code, setCode, runCode, formatCode, onResizeStart }: EditorPanelProps) {
  const [formatting, setFormatting] = useState(false);

  const handleRunCode = () => runCode();

  const handleFormatCode = async () => {
    try {
      setFormatting(true);
      
      // Ensure we have a string and handle potential Promise
      const codeToFormat = String(code || "");
      
      let formatted;
      try {
        // Try synchronous formatting first
        formatted = prettier.format(codeToFormat, {
          parser: "html",
          plugins: [parserHtml],
        });
        
        // If it returns a Promise, await it
        if (formatted && typeof formatted.then === 'function') {
          formatted = await formatted;
        }
      } catch (syncError) {
        console.log('Sync formatting failed, trying async:', syncError);
        // If synchronous fails, it might be an async function
        formatted = await prettier.format(codeToFormat, {
          parser: "html",
          plugins: [parserHtml],
        });
      }
      
      // Ensure we have a string result
      const formattedString = String(formatted || codeToFormat);
      setCode(formattedString);
      
    } catch (err) {
      console.error("Formatting failed:", err);
      
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('Unexpected token')) {
          alert("Formatting failed: Invalid HTML syntax. Please check your code.");
        } else {
          alert(`Formatting failed: ${err.message}`);
        }
      } else {
        alert("Formatting failed. Please check the console for details.");
      }
    } finally {
      setFormatting(false);
    }
  };

  const simpleFormatCode = () => {
    try {
      setFormatting(true);
      
      const codeToFormat = String(code || "");
      
      const formatted = codeToFormat
        .replace(/(>)(<)(\/*)/g, '$1\n$2$3')
        .replace(/(<([^>]+)>)/g, '\n$1\n')
        .replace(/\n+/g, '\n')
        .split('\n')
        .map(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('</')) {
            return line;
          }
          if (trimmed.endsWith('>') && !trimmed.startsWith('</') && !trimmed.startsWith('<')) {
            return '  ' + line;
          }
          return line;
        })
        .join('\n')
        .trim();
      
      setCode(formatted);
      
    } catch (err) {
      console.error("Simple formatting failed:", err);
      alert("Formatting failed. Using basic formatting instead.");
      
      const basicFormatted = String(code || "")
        .replace(/(>)(<)(\/*)/g, '$1\n$2$3')
        .replace(/\n+/g, '\n')
        .trim();
      
      setCode(basicFormatted);
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
      .catch((err) => console.error(err));
  };

  const lineNumbers = useMemo(() => {
    const totalLines = String(code || "").split("\n").length;
    return Array.from({ length: totalLines }, (_, i) => i + 1);
  }, [code]);

  return (
    <div className="flex flex-col h-full bg-panel-bg text-foreground rounded-lg overflow-hidden relative">
      {/* Resize Handle on the right side */}
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
          <button className="btn btn-primary" onClick={handleRunCode}>
            Run Code
          </button>
          <button
            className="btn btn-success"
            onClick={handleFormatCode}
            disabled={formatting}
          >
            {formatting ? "Formatting..." : "Format Code"}
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
      <div className="flex flex-1 overflow-auto relative">
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
        <div className="flex-1 relative">
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
              paddingLeft: 5,
            }}
            textareaClassName="editor-textarea"
            preClassName="editor-pre"
          />
        </div>
      </div>

      {/* Prism + Editor styles */}
      <style jsx global>{`
        /* Main editor container styles */
        .editor-pre,
        .editor-textarea {
          margin: 0 !important;
          padding: 0 !important;
          font-family: "Fira Code", monospace !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          white-space: pre !important;
          word-wrap: normal !important;
          overflow-wrap: normal !important;
          tab-size: 2 !important;
          outline: none !important;
        }

        .editor-pre {
          background: var(--panel-bg) !important;
          color: var(--foreground) !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          pointer-events: none !important;
          z-index: 1 !important;
          overflow: hidden !important;
        }

        .editor-textarea {
          background: transparent !important;
          border: none !important;
          resize: none !important;
          position: relative !important;
          z-index: 2 !important;
          caret-color: var(--foreground) !important;
          color: transparent !important; /* Make text transparent so we only see highlighted text from pre */
        }

        /* Fix for react-simple-code-editor specific classes */
        .react-simple-code-editor {
          position: relative !important;
          overflow: auto !important;
        }

        .react-simple-code-editor textarea {
          outline: none !important;
          border: none !important;
          background: transparent !important;
          caret-color: var(--foreground) !important;
          color: transparent !important;
          /* Ensure proper cursor positioning */
          position: relative !important;
          z-index: 2 !important;
        }

        .react-simple-code-editor pre {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          pointer-events: none !important;
          z-index: 1 !important;
          margin: 0 !important;
          padding: inherit !important;
          overflow: hidden !important;
        }

        /* Cursor blink animation */
        .editor-textarea,
        .react-simple-code-editor textarea {
          animation: cursor-blink 1.2s steps(2, start) infinite !important;
        }

        @keyframes cursor-blink {
          0%, 50% {
            border-left: 1px solid var(--foreground);
          }
          51%, 100% {
            border-left: 1px solid transparent;
          }
        }

        /* Alternative cursor styling using caret */
        .editor-textarea::-webkit-input-placeholder {
          color: transparent;
        }

        .editor-textarea::-moz-placeholder {
          color: transparent;
        }

        .editor-textarea:-ms-input-placeholder {
          color: transparent;
        }

        .editor-textarea::-ms-input-placeholder {
          color: transparent;
        }

        .editor-textarea::placeholder {
          color: transparent;
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

        /* Ensure proper textarea sizing */
        .react-simple-code-editor textarea {
          min-height: 100% !important;
          width: 100% !important;
          padding: 15px !important;
          padding-left: 5px !important;
          overflow: auto !important;
        }

        /* Fix for line height consistency */
        .react-simple-code-editor textarea,
        .react-simple-code-editor pre {
          line-height: 1.5 !important;
          font-size: 14px !important;
          font-family: "Fira Code", monospace !important;
        }
      `}</style>
    </div>
  );
}






