// types/index.ts
export type AiMode = "response" | "chat";
export type ChatRole = "user" | "assistant";

export interface Component {
  [key: string]: string;
}

export interface ComponentCategories {
  [key: string]: string[];
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface PanelWidths {
  components: number;
  editor: number;
  preview: number;
}

export interface Settings {
  aiEndpoint: string;
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  autoFormat: boolean;
}

export interface AiResponse {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}
