"use client";

import { useState } from "react";
import ComponentsPanel from "@/components/ComponentsPanel";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  const [code, setCode] = useState(`<!-- Welcome to the AI Website Builder! -->
<!-- Drag components from the left or use the AI assistant to generate code -->
<div style="text-align: center; padding: 2rem;">
  <h1>Welcome to Your Website</h1>
  <p>Start building by using components from the left or the AI assistant!</p>
</div>`);

  const runCode = () => {
    console.log("Code updated:", code);
  };

  const formatCode = () => {
    const formatted = code.replace(/(>)(<)/g, '$1\n$2');
    setCode(formatted);
  };

  const insertComponent = (html: string) => {
    setCode((prev) => prev + "\n" + html);
  };

  const insertAiCode = (html: string) => {
    setCode((prev) => prev + "\n" + html);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      margin: 0, 
      padding: 0 
    }}>
      {/* Main Content Area */}
      <div style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: 'calc(100vh - 40px)',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}>
        {/* Components Panel */}
        <div className="panel components-panel" style={{ height: '100%' }}>
          <ComponentsPanel 
            onInsert={insertComponent} 
            onAiInsert={insertAiCode} 
          />
        </div>

        {/* Editor Panel */}
        <div className="panel editor-panel" style={{ height: '100%' }}>
          <EditorPanel
            code={code}
            setCode={setCode}
            runCode={runCode}
            formatCode={formatCode}
          />
        </div>

        {/* Preview Panel */}
        <div className="panel preview-panel" style={{ height: '100%', flex: 1 }}>
          <PreviewPanel code={code} />
        </div>
      </div>

      {/* Status Bar - Fixed at bottom */}
      <StatusBar />
    </div>
  );
}

