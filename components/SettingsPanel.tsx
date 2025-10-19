"use client";

import { useState, useEffect } from "react";
import { Settings, X, Wifi, WifiOff, Cpu } from "lucide-react";
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
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
        setAvailableModels([]);
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      setAvailableModels([]);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleTestConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-panel-bg rounded-lg p-6 w-96 max-w-full border border-panel-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Cpu size={20} />
            LM Studio Settings
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              LM Studio Server
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiEndpoint}
                onChange={(e) => setAiEndpoint(e.target.value)}
                placeholder="http://localhost:1234"
                className="flex-1 px-3 py-2 bg-component-bg border border-panel-border rounded text-sm text-foreground focus:outline-none focus:border-accent-color"
              />
              <div className={`${
                connectionStatus === 'connected' ? 'text-green-500' : 
                connectionStatus === 'disconnected' ? 'text-red-500' : 
                'text-yellow-500'
              }`}>
                {connectionStatus === 'connected' ? <Wifi size={16} /> : <WifiOff size={16} />}
              </div>
            </div>
            <p className="text-xs text-text-muted mt-1">
              LM Studio runs on HTTP - use localhost for development
            </p>
          </div>

          {/* Quick Endpoint Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAiEndpoint("http://localhost:1234")}
              className="bg-component-bg border border-panel-border rounded py-2 px-3 text-xs hover:bg-component-hover transition-colors"
            >
              Localhost
            </button>
            <button
              onClick={() => setAiEndpoint("http://10.0.0.20:1234")}
              className="bg-component-bg border border-panel-border rounded py-2 px-3 text-xs hover:bg-component-hover transition-colors"
            >
              Local IP
            </button>
            <button
              onClick={() => setAiEndpoint("http://lms.jessejesse.com")}
              className="bg-component-bg border border-panel-border rounded py-2 px-3 text-xs hover:bg-component-hover transition-colors col-span-2"
            >
              Cloudflare Tunnel
            </button>
          </div>

          {/* Connection Status */}
          {connectionStatus === 'connected' && availableModels.length > 0 && (
            <div className="bg-component-bg border border-green-500 rounded p-3">
              <div className="flex items-center gap-2 text-green-500 text-sm mb-2">
                <Wifi size={14} />
                <span>Connected to LM Studio</span>
              </div>
              <div className="text-xs text-text-muted">
                <div>Available models:</div>
                <div className="mt-1 space-y-1">
                  {availableModels.map((model, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {connectionStatus === 'disconnected' && (
            <div className="bg-component-bg border border-red-500 rounded p-3">
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <WifiOff size={14} />
                <span>Cannot connect to LM Studio</span>
              </div>
              <div className="text-xs text-text-muted mt-1">
                Make sure LM Studio is running and the server is active
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="flex-1 bg-button-secondary text-white py-2 px-4 rounded text-sm font-medium disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          <div className="flex gap-2 pt-4 border-t border-panel-border">
            <button
              onClick={onClose}
              className="flex-1 bg-button-secondary text-white py-2 px-4 rounded text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-button-primary text-white py-2 px-4 rounded text-sm font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
