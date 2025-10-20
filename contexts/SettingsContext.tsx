"use client";

import React, { createContext, useContext } from "react";

interface SettingsContextType {
  askAI: (prompt: string) => Promise<string>;
  aiEndpoint?: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const aiEndpoint = "/api"; 

  const askAI = async (prompt: string) => {
    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.text || "No response";
    } catch (err) {
      console.error("AI request failed:", err);
      return "Error contacting AI";
    }
  };

  return (
    <SettingsContext.Provider value={{ askAI, aiEndpoint }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}




