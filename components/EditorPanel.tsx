// --- components/EditorPanel.tsx ---

"use client";

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="panel-header">
        <h2>Code Editor</h2>
        <div>
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to clear the editor?')) {
                setCode("");
              }
            }}
            style={{
              background: '#f38ba8',
              color: '#1e1e2e',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Clear
          </button>
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Start coding here or use components from the left..."
      />
      
      <div className="toolbar">
        <button onClick={runCode}>Run Code</button>
        <button onClick={formatCode}>Format Code</button>
      </div>
    </div>
  );
}

