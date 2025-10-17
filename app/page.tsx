"use client";

import { useState } from "react";
import ComponentsPanel from "@/components/ComponentsPanel";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  const [code, setCode] = useState("");

  const runCode = () => console.log("Running code...");
  const formatCode = () => setCode(code.replace(/\s+/g, " ").trim());

  const insertComponent = (html: string) => setCode((prev) => prev + "\n" + html);
  const insertAiCode = (html: string) => setCode((prev) => prev + "\n" + html);

  return (
    <div className="container">
      {/* Components Panel */}
      <div className="panel components-panel">
        <ComponentsPanel onInsert={insertComponent} onAiInsert={insertAiCode} />
      </div>

      {/* Editor Panel */}
      <div className="panel editor-panel">
        <EditorPanel code={code} setCode={setCode} runCode={runCode} formatCode={formatCode} />
      </div>

      {/* Preview Panel */}
      <div className="panel preview-panel">
        <PreviewPanel code={code} />
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}

