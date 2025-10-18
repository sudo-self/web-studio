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
      {/* All buttons in header row */}
      <div className="panel-header" style={{ gap: '10px', flexWrap: 'wrap' }}>
        <h2 style={{ marginRight: 'auto' }}>Code Editor</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={runCode}
            style={{
              background: '#89b4fa',
              color: '#1e1e2e',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Run Code
          </button>
          <button
            onClick={formatCode}
            style={{
              background: '#a6e3a1',
              color: '#1e1e2e',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Format Code
          </button>
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
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Textarea takes remaining space */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Start coding here or use components from the left..."
        style={{
          flex: 1,
          minHeight: '200px'
        }}
      />
    </div>
  );
}

