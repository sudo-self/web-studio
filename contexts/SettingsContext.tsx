"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  aiEndpoint: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// Use localhost as default since that's where LM Studio usually runs
const defaultSettings: Settings = {
  aiEndpoint: "http://10.10.20:1234"  // Changed from 10.0.0.20 to localhost
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('website-builder-settings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('website-builder-settings', JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
