"use client";

import React, { createContext, useContext, useState } from "react";

// Settings interface
interface Settings {
  theme: "light" | "dark";
  fontSize: number;
}

// Context type
interface SettingsContextType {
  askAI: (prompt: string) => Promise<string>; // Function to call AI
  aiEndpoint: string;                          // AI endpoint URL
  settings: Settings;                          // User settings
  updateSettings: (newSettings: Partial<Settings>) => void; // Update settings
}

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Set the AI endpoint (can be local API or remote)
  const aiEndpoint = "/api"; // points to app/api/route.ts

  // Function to call AI
  const askAI = async (prompt: string) => {
    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.text || "No response from AI";
    } catch (err) {
      console.error("AI request failed:", err);
      return "Error contacting AI";
    }
  };

  // State for settings
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    fontSize: 14,
  });

  // Function to update settings
  const updateSettings = (newSettings: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...newSettings }));

  // Provide everything via context
  return (
    <SettingsContext.Provider value={{ askAI, aiEndpoint, settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}






