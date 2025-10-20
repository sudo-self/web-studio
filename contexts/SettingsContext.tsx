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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(settings.aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          mode: "response"
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`AI API error: ${response.status} - ${errorText}`);
      }

      if (!response.body) {
        throw new Error("No response body from AI API");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          
          // Handle DeepSeek streaming format (Server-Sent Events)
          const lines = chunk.split('\n').filter(Boolean);
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.replace(/^data: /, '');
              if (jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                // DeepSeek format: parsed.choices[0].delta.content
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  aiText += delta;
                  if (onChunk) onChunk(delta);
                }
              } catch (e) {
                console.warn("Failed to parse DeepSeek SSE chunk:", line, e);
              }
            } else if (line.trim() && !line.startsWith('data: ')) {
              // Handle non-SSE format (direct text streaming)
              aiText += line;
              if (onChunk) onChunk(line);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Clean the response
      const cleanedText = cleanAIResponse(aiText);
      return cleanedText || "No response from AI";

    } catch (err) {
      console.error("AI streaming failed:", err);
      
      if (err instanceof Error && err.name === 'AbortError') {
        return "AI request timed out. Please try again.";
      }
      
      return `Error contacting AI: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }
  };

  // Helper function to clean AI response
  const cleanAIResponse = (text: string): string => {
    if (!text) return "";
    
    let cleaned = text
      .replace(/^```(?:html|js|css)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .replace(/^`|`$/g, '')
      .trim();

    // If it looks like HTML, ensure it's properly formatted
    if (cleaned.includes('<') && cleaned.includes('>')) {
      // Remove any leading text before the first HTML tag
      const firstTagIndex = cleaned.indexOf('<');
      if (firstTagIndex > 0) {
        cleaned = cleaned.substring(firstTagIndex);
      }
    }

    return cleaned;
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










