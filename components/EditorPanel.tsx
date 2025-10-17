"use client";

import { useState } from "react";

export default function EditorPanel({
  code,
  setCode,
  runCode,
  formatCode,
}: {
  code: string;
  setCode: (val: string) => void;
  runCode: () => void;
  formatCode: () => void;
}) {
  return (
    <div className="panel editor-panel">
      <div className="panel-header">
        <h2>Code Editor</h2>
        <div>
          <button onClick={() => setCode("")}>Clear</button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Start coding here..."
      />
      <div className="toolbar">
        <button onClick={runCode}>Run</button>
        <button onClick={formatCode}>Format</button>
      </div>
    </div>
  );
}

