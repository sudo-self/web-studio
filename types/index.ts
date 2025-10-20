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
  text?: string;
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
    text?: string;
  }>;
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
    }>;
    };
  }>;
}


export interface ApiRequestBody {
  prompt?: string;
  mode?: AiMode;
  chatHistory?: ChatMessage[];
}

export interface ApiResponse {
  text: string;
  error?: string;
}


export interface GeminiContentPart {
  text: string;
}

export interface GeminiContent {
  parts: GeminiContentPart[];
}

export interface GeminiCandidate {
  content: GeminiContent;
}

export interface GeminiResponse {
  candidates: GeminiCandidate[];
}
