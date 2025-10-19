"use client";

import { useState, useEffect } from "react";
import { Settings, X, Wifi, WifiOff, Cloud, Cpu, CheckCircle } from "lucide-react";
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
        
        const targetModel = "openai/gpt-oss-20b";
        const hasTargetModel = models.includes(targetModel);
        setCurrentModel(hasTargetModel ? targetModel : (models[0] || 'No models found'));
        
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
        setAvailableModels([]);
        setCurrentModel('');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      setAvailableModels([]);
      setCurrentModel('');
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
            <Cloud size={20} />
            AI Settings
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
              LM Studio Server (HTTP)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiEndpoint}
                onChange={(e) => setAiEndpoint(e.target.value)}
                placeholder="http://lms.jessejesse.com"
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
              Cloudflare tunnel: http://lms.jessejesse.com → http://10.0.0.20:1234
            </p>
          </div>

          {/* Connection Status */}
          {connectionStatus === 'connected' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
                <CheckCircle size={16} />
                <span className="font-medium">Connected via Cloudflare Tunnel</span>
              </div>
              {currentModel && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-300 text-xs mt-1">
                  <Cpu size={12} />
                  <span>Active: {currentModel}</span>
                </div>
              )}
              {availableModels.length > 0 && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-300">
                  <div>Available models:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {availableModels.map((model, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded ${
                          model === 'openai/gpt-oss-20b' 
                            ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {connectionStatus === 'disconnected' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
                <WifiOff size={16} />
                <span className="font-medium">Connection Failed</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                Check if LM Studio is running and tunnel is active
              </p>
            </div>
          )}

          {/* Quick Endpoint Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAiEndpoint("http://lms.jessejesse.com")}
              className="bg-component-bg border border-panel-border rounded py-2 px-3 text-xs hover:bg-component-hover transition-colors"
            >
              Cloudflare Tunnel
            </button>
            <button
              onClick={() => setAiEndpoint("http://localhost:1234")}
              className="bg-component-bg border border-panel-border rounded py-2 px-3 text-xs hover:bg-component-hover transition-colors"
            >
              Localhost
            </button>
            <button
              onClick={() => setAiEndpoint("http://10.0.0.20:1234")}
              className="bg-component-bg border border-panel-border rounded py-2 px-3 text-xs hover:bg-component-hover transition-colors col-span-2"
            >
              Local Network IP
            </button>
          </div>

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
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
