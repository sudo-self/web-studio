// --- contexts/SettingsContext.tsx ---

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Settings {
  aiEndpoint: string;
  theme: "light" | "dark" | "auto";
  fontSize: number;
  autoFormat: boolean;
}

export interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  askAI: (prompt: string) => Promise<string>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({
    aiEndpoint: "/api/ai",
    theme: "light",
    fontSize: 14,
    autoFormat: true,
  });

  const updateSettings = (newSettings: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...newSettings }));

  const askAI = async (prompt: string): Promise<string> => {
    if (!prompt.trim()) return "";

    try {
      const response = await fetch(settings.aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.text || "No response from AI";

    } catch (err) {
      console.error("AI request failed:", err);
      return `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, askAI }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};











