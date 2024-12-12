// src/client/interfaces.ts
export interface WhatsAppBlockProps {
  sessionId?: string;
  collection: string;
  association?: string;
  // Add other props as needed
}

export interface WhatsAppMessage {
  id: string;
  content: string;
  timestamp: Date;
  // Add other message properties
}