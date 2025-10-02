/**
 * Chat types
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatOptions {
  /** Previous messages for context */
  history?: ChatMessage[];
  
  /** Request timeout in ms */
  timeout?: number;
  
  /** System prompt override */
  systemPrompt?: string;
  
  /** Max tokens in response */
  maxTokens?: number;
  
  /** Temperature (0-1) */
  temperature?: number;
}

export interface ChatResponse {
  /** AI response text */
  message: string;
  
  /** x402 payment tx hash */
  paymentTx?: string;
  
  /** Token usage */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamChunk {
  /** Partial content */
  content: string;
  
  /** Is final chunk */
  done: boolean;
  
  /** Chunk index */
  index: number;
}

export interface ChatStreamOptions extends ChatOptions {
  /** Callback for each chunk */
  onChunk?: (chunk: StreamChunk) => void;
}

