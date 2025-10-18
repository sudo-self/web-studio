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
  const handleRunCode = () => {
    console.log("Running code:", code);
    runCode();
  };

  const handleFormatCode = () => {
    console.log("Formatting code");
    formatCode();
  };

  const handleClearCode = () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      setCode("");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* All buttons in header row */}
      <div className="panel-header" style={{ 
        gap: '10px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <h2 style={{ marginRight: 'auto', margin: 0 }}>Code Editor</h2>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleRunCode}
            style={{
              background: '#89b4fa',
              color: '#1e1e2e',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              minWidth: '100px'
            }}
          >
            Run Code
          </button>
          <button
            onClick={handleFormatCode}
            style={{
              background: '#a6e3a1',
              color: '#1e1e2e',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              minWidth: '100px'
            }}
          >
            Format Code
          </button>
          <button
            onClick={handleClearCode}
            style={{
              background: '#f38ba8',
              color: '#1e1e2e',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              minWidth: '100px'
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
          minHeight: '200px',
          margin: 0
        }}
      />
    </div>
  );
}

