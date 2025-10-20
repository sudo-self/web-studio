"use client";

import React, { createContext, useContext } from "react";

interface SettingsContextType {
  askAI: (prompt: string) => Promise<string>;
  // Optional: include endpoint if you want
  aiEndpoint?: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const aiEndpoint = "/api/ask-ai"; // Optional, for reference

  const askAI = async (prompt: string) => {
    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

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



