"use client";

import React, { createContext, useContext } from 'react';

interface SettingsContextType {
  askAI: (prompt: string) => Promise<string>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const askAI = async (prompt: string) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": "https://ai-web-studio.netlify.app",
          "X-Title": "ai web studio",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3.1:free",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No response";
    } catch (err) {
      console.error("AI request failed:", err);
      return "Error contacting AI";
    }
  };

  return (
    <SettingsContext.Provider value={{ askAI }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

