"use client";

import { useState, useRef, useEffect } from "react";
import ComponentsPanel from "@/components/ComponentsPanel";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import StatusBar from "@/components/StatusBar";
import SettingsPanel from "@/components/SettingsPanel";

export default function Home() {
  const [code, setCode] = useState(`<!-- Welcome to studio.jessejesse.com -->
<div style="text-align: center; padding: 2rem;">
  <h1>Your Awesome Website</h1>
 <p>Start building by adding components from the sidebar, using the AI assistant, or writing code directly in the editor.</p>
</div>`);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [panelWidths, setPanelWidths] = useState({
    components: 280,
    editor: 600,
    preview: 400,
  });
  const [resizingPanel, setResizingPanel] = useState<string | null>(null);

  const startXRef = useRef<number>(0);
  const startWidthsRef = useRef(panelWidths);

 
  const runCode = () => {
    console.log("Code updated:", code);
  };


  const formatCode = () => {
    const formatted = code.replace(/(>)(<)/g, "$1\n$2");
    setCode(formatted);
  };


  const insertComponent = (html: string) => {
    setCode((prev) => prev + "\n" + html);
  };


  const insertAiCode = (html: string) => {
    setCode((prev) => prev + "\n" + html);
  };


  const handleResizeStart = (panel: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingPanel(panel);
    startXRef.current = e.clientX;
    startWidthsRef.current = { ...panelWidths };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };


  useEffect(() => {
    if (!resizingPanel) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startXRef.current;

      setPanelWidths((prev) => {
        const newWidths = { ...prev };

        if (resizingPanel === "components") {
          const newWidth = Math.max(
            200,
            Math.min(500, startWidthsRef.current.components + deltaX)
          );
          newWidths.components = newWidth;
        } else if (resizingPanel === "editor") {
          const newWidth = Math.max(
            300,
            Math.min(800, startWidthsRef.current.editor + deltaX)
          );
          newWidths.editor = newWidth;
        }

        return newWidths;
      });
    };

    const handleMouseUp = () => {
      setResizingPanel(null);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingPanel]);

  return (
    <>
      <div className="app-container">
    
        <div className="main-content">
      
          <div
            className="panel components-panel"
            style={{
              width: `${panelWidths.components}px`,
              minWidth: "200px",
              maxWidth: "500px",
              flex: "0 0 auto",
            }}
          >
            <ComponentsPanel
              onInsert={insertComponent}
              onAiInsert={insertAiCode}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onResizeStart={(e) => handleResizeStart("components", e)}
            />
          </div>

       
          <div
            className="w-2 cursor-col-resize bg-panel-border hover:bg-accent-color transition-colors"
            onMouseDown={(e) => handleResizeStart("components", e)}
          />

       
          <div
            className="panel editor-panel"
            style={{
              width: `${panelWidths.editor}px`,
              minWidth: "300px",
              maxWidth: "800px",
              flex: "0 0 auto",
            }}
          >
            <EditorPanel
              code={code}
              setCode={setCode}
              runCode={runCode}
              formatCode={formatCode} 
              onResizeStart={(e) => handleResizeStart("editor", e)}
            />
          </div>

       
          <div
            className="w-2 cursor-col-resize bg-panel-border hover:bg-accent-color transition-colors"
            onMouseDown={(e) => handleResizeStart("editor", e)}
          />

       
          <div
            className="panel preview-panel"
            style={{ flex: 1, minWidth: "300px" }}
          >
            <PreviewPanel code={code} />
          </div>
        </div>

     
        <StatusBar />
      </div>

     
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <style jsx global>{`
        .bg-panel-border {
          background-color: var(--panel-border);
        }
        .bg-accent-color {
          background-color: var(--accent-color);
        }
      `}</style>
    </>
  );
}


