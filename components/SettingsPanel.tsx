"use client";

import { useState, useEffect } from "react";
import { Settings, X, Wifi, WifiOff, Cloud, Cpu } from "lucide-react";
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
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');

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
        const modelsData = await response.json();
        const models = modelsData.data?.map((model: any) => model.id) || [];
        setAvailableModels(models);
        
        // Check if our target model is available
        const targetModel = "openai/gpt-oss-20b";
        const hasTargetModel = models.includes(targetModel);
        setCurrentModel(hasTargetModel ? targetModel : (models[0] || 'No models found'));
        
        setConnectionStatus('connected');
        
        if (hasTargetModel) {
          alert(`✅ Connection successful! GPT-OSS-20B model is available and ready.`);
        } else {
          alert(`✅ Connection successful, but GPT-OSS-20B not found. Using: ${models[0] || 'No models available'}`);
        }
      } else {
        setConnectionStatus('disconnected');
        setAvailableModels([]);
        setCurrentModel('');
        alert('❌ Connection failed. Server responded with error.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      setAvailableModels([]);
      setCurrentModel('');
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
        width: '420px',
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
            AI Settings
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
          {/* Endpoint Configuration */}
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
              </div>
            </div>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '4px',
              marginBottom: 0
            }}>
              Cloudflare tunnel: http://10.0.0.20:1234
            </p>
          </div>

          {/* Connection Status Card */}
          {connectionStatus !== 'unknown' && (
            <div style={{ 
              backgroundColor: 'var(--panel-bg)',
              border: `1px solid ${connectionStatus === 'connected' ? 'var(--button-success)' : 'var(--button-danger)'}`,
              borderRadius: '6px',
              padding: '12px',
              fontSize: '13px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: connectionStatus === 'connected' ? 'var(--button-success)' : 'var(--button-danger)',
                marginBottom: '8px'
              }}>
                {connectionStatus === 'connected' ? <Wifi size={16} /> : <WifiOff size={16} />}
                <strong>
                  {connectionStatus === 'connected' ? 'Connected to AI Server' : 'Connection Failed'}
                </strong>
              </div>
              
              {connectionStatus === 'connected' && currentModel && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <Cpu size={14} />
                  <span>Active Model: <strong>{currentModel}</strong></span>
                </div>
              )}
              
              {availableModels.length > 0 && (
                <div style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '12px', marginBottom: '4px' }}>Available Models:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                    {availableModels.map((model, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        color: model === 'openai/gpt-oss-20b' ? 'var(--button-success)' : 'var(--text-muted)'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: model === 'openai/gpt-oss-20b' ? 'var(--button-success)' : 'var(--text-muted)'
                        }} />
                        {model}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
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
              {testing ? 'Testing...' : 'Test Connection'}
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
              Reset to Tunnel
            </button>
          </div>

          {/* Save/Cancel Buttons */}
          <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--panel-border)' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: 'var(--button-secondary)',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
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
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
