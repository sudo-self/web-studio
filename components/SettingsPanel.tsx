"use client";

import { useState } from "react";
import { X, Cloud, Wifi, WifiOff } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, askAI } = useSettings();
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');

  const handleTestConnection = async () => {
    setTesting(true);
    setConnectionStatus('unknown');

    try {
      const response = await askAI("Test connection");
      if (response && response !== "Error contacting AI") {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch {
      setConnectionStatus('disconnected');
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-primary rounded-xl p-6 w-96 max-w-full border border-border-primary shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
            <Cloud size={20} />
            AI Settings
          </h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 text-sm ${
            connectionStatus === 'connected' ? 'text-interactive-success' : 
            connectionStatus === 'disconnected' ? 'text-interactive-danger' : 
            'text-yellow-600'
          }`}>
            {connectionStatus === 'connected' ? <Wifi size={16} /> : connectionStatus === 'disconnected' ? <WifiOff size={16} /> : <Wifi size={16} />}
            <span>
              {connectionStatus === 'connected' ? 'Connected to AI' :
               connectionStatus === 'disconnected' ? 'Connection Failed' : 'Unknown'}
            </span>
          </div>

          {/* Test Button */}
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="w-full bg-interactive-accent hover:bg-interactive-accent/90 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>

          {/* Endpoint Display */}
          <div className="text-xs text-text-tertiary bg-surface-tertiary px-3 py-2 rounded-lg">
            Endpoint: {settings.aiEndpoint.replace('http://', '')}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-surface-secondary border border-border-primary hover:bg-surface-tertiary text-text-primary py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}






