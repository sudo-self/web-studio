"use client";

import { useState, useEffect } from "react";
import { Settings, X, Wifi, WifiOff, Cloud, Cpu, Shield, AlertTriangle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useSettings();
  const [aiEndpoint, setAiEndpoint] = useState(settings.aiEndpoint);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'mixed-content' | 'unknown'>('unknown');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSave = () => {
    // Auto-convert to HTTPS if needed
    let endpointToSave = aiEndpoint;
    if (endpointToSave.startsWith('http://') && typeof window !== 'undefined' && window.location.protocol === 'https:') {
      endpointToSave = endpointToSave.replace('http://', 'https://');
    }
    
    updateSettings({ aiEndpoint: endpointToSave });
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setErrorMessage('');
    
    try {
      // Check if we're in HTTPS context and trying to use HTTP
      const isHttpsContext = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const isHttpEndpoint = aiEndpoint.startsWith('http://');
      
      if (isHttpsContext && isHttpEndpoint) {
        setConnectionStatus('mixed-content');
        setErrorMessage('Mixed Content Error: Cannot use HTTP endpoint from HTTPS site.');
        alert('❌ Mixed Content Error: Your Vercel app uses HTTPS but your AI endpoint uses HTTP. Please use HTTPS or run locally.');
        return;
      }

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
        setErrorMessage(`Server responded with ${response.status}`);
        alert('❌ Connection failed. Server responded with error.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      setAvailableModels([]);
      setCurrentModel('');
      
      if (error instanceof TypeError) {
        if (error.message.includes('mixed content')) {
          setConnectionStatus('mixed-content');
          setErrorMessage('Mixed Content Blocked: HTTPS site cannot access HTTP resources');
        } else if (error.message.includes('Failed to fetch')) {
          setErrorMessage('Network Error: Cannot reach the server. Check if LM Studio is running.');
        } else {
          setErrorMessage(`Network Error: ${error.message}`);
        }
      } else {
        setErrorMessage('Unknown error occurred');
      }
      
      alert('❌ Connection failed. Make sure LM Studio is running and the tunnel is active.');
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

  // Auto-detect if we need HTTPS
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const isHttps = window.location.protocol === 'https:';
      const isHttpEndpoint = aiEndpoint.startsWith('http://');
      
      if (isHttps && isHttpEndpoint) {
        setConnectionStatus('mixed-content');
        setErrorMessage('Mixed Content: Change to HTTPS or run locally');
      }
    }
  }, [isOpen, aiEndpoint]);

  if (!isOpen) return null;

  const isHttpsContext = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isHttpEndpoint = aiEndpoint.startsWith('http://');

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
        width: '440px',
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
            {isHttpsContext && (
              <Shield size={16} style={{ color: 'var(--button-success)' }} title="HTTPS Secure Context" />
            )}
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
          {/* Security Warning */}
          {isHttpsContext && isHttpEndpoint && (
            <div style={{ 
              backgroundColor: 'var(--button-warning)',
              color: '#1e1e2e',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <strong>Mixed Content Warning</strong>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Your Vercel app uses HTTPS but your endpoint uses HTTP. 
                  Browsers will block this connection. 
                  <br />
                  <strong>Solutions:</strong>
                  <br />• Use HTTPS endpoint: https://lms.jessejesse.com
                  <br />• Run locally with HTTP
                </div>
              </div>
            </div>
          )}

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
                placeholder={isHttpsContext ? "https://lms.jessejesse.com" : "http://lms.jessejesse.com"}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: `1px solid ${
                    connectionStatus === 'mixed-content' ? 'var(--button-warning)' : 
                    connectionStatus === 'connected' ? 'var(--button-success)' : 
                    connectionStatus === 'disconnected' ? 'var(--button-danger)' : 
                    'var(--panel-border)'
                  }`,
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
                      connectionStatus === 'mixed-content' ? 'var(--button-warning)' :
                      connectionStatus === 'disconnected' ? 'var(--button-danger)' : 'var(--text-muted)'
              }}>
                {connectionStatus === 'connected' ? <Wifi size={16} /> : 
                 connectionStatus === 'mixed-content' ? <AlertTriangle size={16} /> : 
                 <WifiOff size={16} />}
              </div>
            </div>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '4px',
              marginBottom: 0
            }}>
              {isHttpsContext 
                ? '⚠️ HTTPS required for Vercel deployment' 
                : 'Cloudflare tunnel: http://10.0.0.20:1234'
              }
            </p>
          </div>

          {/* Connection Status Card */}
          {connectionStatus !== 'unknown' && (
            <div style={{ 
              backgroundColor: 'var(--panel-bg)',
              border: `1px solid ${
                connectionStatus === 'connected' ? 'var(--button-success)' : 
                connectionStatus === 'mixed-content' ? 'var(--button-warning)' :
                'var(--button-danger)'
              }`,
              borderRadius: '6px',
              padding: '12px',
              fontSize: '13px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: connectionStatus === 'connected' ? 'var(--button-success)' : 
                      connectionStatus === 'mixed-content' ? 'var(--button-warning)' :
                      'var(--button-danger)',
                marginBottom: '8px'
              }}>
                {connectionStatus === 'connected' ? <Wifi size={16} /> : 
                 connectionStatus === 'mixed-content' ? <AlertTriangle size={16} /> : 
                 <WifiOff size={16} />}
                <strong>
                  {connectionStatus === 'connected' ? 'Connected to AI Server' : 
                   connectionStatus === 'mixed-content' ? 'Mixed Content Blocked' : 
                   'Connection Failed'}
                </strong>
              </div>
              
              {errorMessage && (
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px' }}>
                  {errorMessage}
                </div>
              )}
              
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
              disabled={testing || connectionStatus === 'mixed-content'}
              style={{
                flex: 1,
                background: connectionStatus === 'mixed-content' ? 'var(--button-warning)' : 'var(--button-secondary)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: (testing || connectionStatus === 'mixed-content') ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                opacity: (testing || connectionStatus === 'mixed-content') ? 0.6 : 1
              }}
            >
              {testing ? 'Testing...' : 
               connectionStatus === 'mixed-content' ? 'Fix HTTPS First' : 
               'Test Connection'}
            </button>
            <button
              onClick={() => setAiEndpoint(isHttpsContext ? "https://lms.jessejesse.com" : "http://lms.jessejesse.com")}
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
              Use {isHttpsContext ? 'HTTPS' : 'Tunnel'} URL
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
