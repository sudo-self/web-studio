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
  askAI: (prompt: string, onChunk?: (chunk: string) => void) => Promise<string>;
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

  const askAI = async (prompt: string, onChunk?: (chunk: string) => void): Promise<string> => {
    if (!prompt.trim()) return "";

    try {
      const response = await fetch(settings.aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.body) throw new Error("No response body from AI API");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiText += chunk;

        if (onChunk) onChunk(chunk);
      }

      // Remove code block fences
      const cleanedText = aiText
        .replace(/^```(?:html|js|css)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      return cleanedText || "No response from AI";
    } catch (err) {
      console.error("AI streaming failed:", err);
      return "Error contacting AI";
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










