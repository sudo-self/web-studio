"use client";

import { useState } from "react";
import { X, Cloud, Wifi, WifiOff } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { askAI, aiEndpoint } = useSettings();
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');

  const handleTestConnection = async () => {
    setTesting(true);
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
          {/* Connection Status */}
          <div className={`flex items-center gap-2 text-sm ${
            connectionStatus === 'connected' ? 'text-green-700' :
            connectionStatus === 'disconnected' ? 'text-red-700' :
            'text-yellow-700'
          }`}>
            {connectionStatus === 'connected' ? <Wifi size={16} /> :
             connectionStatus === 'disconnected' ? <WifiOff size={16} /> :
             <Wifi size={16} />}
            <span>
              {connectionStatus === 'connected' ? `Connected to AI at ${aiEndpoint}` :
               connectionStatus === 'disconnected' ? 'Connection Failed' : 'Unknown'}
            </span>
          </div>

          {/* Test Button */}
          <div className="flex gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="flex-1 bg-button-secondary text-white py-2 px-4 rounded text-sm font-medium disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-panel-border">
            <button
              onClick={onClose}
              className="flex-1 bg-button-secondary text-white py-2 px-4 rounded text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


