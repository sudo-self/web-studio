"use client";

import { useState } from "react";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import Editor from "react-simple-code-editor";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";

interface EditorPanelProps {
  code: string;
  setCode: (val: string) => void;
  runCode: () => void;
}

export default function EditorPanel({ code, setCode, runCode }: EditorPanelProps) {
  const [formatting, setFormatting] = useState(false);

  const handleRunCode = () => {
    runCode();
  };

  const handleFormatCode = () => {
    try {
      setFormatting(true);
      const formatted = prettier.format(code, {
        parser: "html",
        plugins: [parserHtml],
      });
      setCode(formatted);
    } catch (err) {
      console.error("Formatting failed:", err);
      alert("Formatting failed. Check console.");
    } finally {
      setFormatting(false);
    }
  };

  const handleClearCode = () => {
    if (confirm("Are you sure you want to clear the editor?")) {
      setCode("");
    }
  };

  const handleExportCode = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "code.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buttonStyle = (bg: string, disabled = false) => ({
    background: disabled ? "#a6a6a6" : bg,
    color: "#1e1e2e",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontSize: "14px",
    minWidth: "100px",
    transition: "background-color 0.2s",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header buttons */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        flexWrap: "wrap",
        padding: "0 0 10px 0",
        borderBottom: "1px solid var(--panel-border)",
      }}>
        <h2 style={{ margin: 0, color: "var(--foreground)" }}>Code Editor</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={handleRunCode} style={buttonStyle("#89b4fa")}>
            Run Code
          </button>
          <button onClick={handleFormatCode} disabled={formatting} style={buttonStyle("#a6e3a1", formatting)}>
            {formatting ? "Formatting..." : "Format Code"}
          </button>
          <button onClick={handleClearCode} style={buttonStyle("#f38ba8")}>
            Clear
          </button>
          <button onClick={handleExportCode} style={buttonStyle("#f9e2af")}>
            Export
          </button>
        </div>
      </div>

      {/* Syntax Highlighted Editor */}
      <div style={{
        flex: 1,
        marginTop: "10px",
        border: "1px solid var(--panel-border)",
        borderRadius: "6px",
        overflow: "hidden",
      }}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={code => highlight(code, languages.html, 'html')}
          padding={15}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            minHeight: "100%",
            lineHeight: "1.5",
          }}
          textareaClassName="editor-textarea"
          preClassName="editor-pre"
        />
      </div>

      <style jsx>{`
        .editor-textarea {
          outline: none;
          caret-color: var(--foreground);
        }
        .editor-pre {
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
        }
      `}</style>
    </div>
  );
}




