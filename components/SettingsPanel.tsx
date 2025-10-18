"use client";

import { useState } from "react";
import { Settings, X } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useSettings();
  const [aiEndpoint, setAiEndpoint] = useState(settings.aiEndpoint);

  const handleSave = () => {
    updateSettings({ aiEndpoint });
    onClose();
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch(`${aiEndpoint}/v1/models`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        alert('✅ Connection successful! AI server is reachable.');
      } else {
        alert('❌ Connection failed. Server responded with error.');
      }
    } catch (error) {
      alert('❌ Connection failed. Make sure LM Studio is running and the endpoint is correct.');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'var(--panel-bg)',
        borderRadius: '8px',
        padding: '24px',
        width: '384px',
        maxWidth: '100%',
        margin: '0 16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
            color: 'var(--foreground)'
          }}>
            <Settings size={20} />
            Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '8px',
              color: 'var(--foreground)'
            }}>
              AI Server Endpoint
            </label>
            <input
              type="text"
              value={aiEndpoint}
              onChange={(e) => setAiEndpoint(e.target.value)}
              placeholder="http://localhost:1234"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--panel-border)',
                borderRadius: '6px',
                backgroundColor: 'var(--component-bg)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
            />
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '4px',
              marginBottom: 0
            }}>
              Enter the IP and port where LM Studio is running
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleTestConnection}
              style={{
                flex: 1,
                background: 'var(--button-secondary)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Test Connection
            </button>
            <button
              onClick={() => setAiEndpoint("http://10.0.0.20:1234")}
              style={{
                flex: 1,
                background: 'var(--button-warning)',
                color: '#1e1e2e',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Reset to Default
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: 'var(--button-secondary)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                background: 'var(--button-primary)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
