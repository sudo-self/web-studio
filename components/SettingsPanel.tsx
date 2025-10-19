"use client";

import { useState, useEffect } from "react";
import { Settings, X, Wifi, WifiOff, Cloud } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useSettings();
  const [aiEndpoint, setAiEndpoint] = useState(settings.aiEndpoint);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');

  const handleSave = () => {
    updateSettings({ aiEndpoint });
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const response = await fetch(`${aiEndpoint}/v1/models`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        alert('✅ Cloudflare tunnel connection successful! AI server is reachable.');
      } else {
        setConnectionStatus('disconnected');
        alert('❌ Connection failed. Server responded with error.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      alert('❌ Cloudflare tunnel connection failed. Make sure LM Studio is running and the tunnel is active.');
    } finally {
      setTesting(false);
    }
  };

  // Test connection when panel opens
  useEffect(() => {
    if (isOpen) {
      handleTestConnection();
    }
  }, [isOpen]);

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
            <Cloud size={20} />
            AI Settings (Cloudflare Tunnel)
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
              Cloudflare Tunnel Endpoint
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                value={aiEndpoint}
                onChange={(e) => setAiEndpoint(e.target.value)}
                placeholder="http://lms.jessejesse.com"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--component-bg)',
                  color: 'var(--foreground)',
                  outline: 'none'
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: connectionStatus === 'connected' ? 'var(--button-success)' : 
                      connectionStatus === 'disconnected' ? 'var(--button-danger)' : 'var(--text-muted)'
              }}>
                {connectionStatus === 'connected' ? <Wifi size={16} /> : <WifiOff size={16} />}
                <Cloud size={16} />
              </div>
            </div>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '4px',
              marginBottom: 0
            }}>
              Your Cloudflare tunnel endpoint: lms.jessejesse.com
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleTestConnection}
              disabled={testing}
              style={{
                flex: 1,
                background: 'var(--button-secondary)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: testing ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                opacity: testing ? 0.6 : 1
              }}
            >
              {testing ? 'Testing Tunnel...' : 'Test Tunnel Connection'}
            </button>
            <button
              onClick={() => setAiEndpoint("http://lms.jessejesse.com")}
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
              Use Tunnel URL
            </button>
          </div>

          <div style={{ 
            backgroundColor: 'var(--panel-bg)',
            border: '1px solid var(--panel-border)',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            <strong>Cloudflare Tunnel Status:</strong>
            <div style={{ marginTop: '4px' }}>
              • Tunnel: lms.jessejesse.com → http://10.0.0.20:1234
            </div>
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
