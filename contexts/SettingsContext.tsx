"use client";

import React, { createContext, useContext, useState } from "react";
import { Settings } from "@/types";

interface SettingsContextType {
  askAI: (prompt: string) => Promise<string>;
  aiEndpoint: string;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const aiEndpoint = "/api"; // This is your API route

  const askAI = async (prompt: string) => {
    try {
      const res = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      return data.text || "No response";
    } catch (err) {
      console.error("AI request failed:", err);
      return "Error contacting AI";
    }
  };

  const [settings, setSettings] = useState<Settings>({
    aiEndpoint,     // must match your types
    theme: "light",
    fontSize: 14,
    autoFormat: true,
  });

  const updateSettings = (newSettings: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...newSettings }));

  return (
    <SettingsContext.Provider value={{ askAI, aiEndpoint, settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}







