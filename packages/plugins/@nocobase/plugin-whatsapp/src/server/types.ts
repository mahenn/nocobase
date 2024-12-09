// src/server/types.ts
export interface WhatsappSession {
  id: string;
  status: 'connecting' | 'connected' | 'disconnected';
  qr?: string;
}

export interface WhatsappContact {
  id: string;
  sessionId: string;
  name?: string;
  number: string;
  jid: string;
}

export interface BulkMessageRequest {
  jid: string;
  type?: 'number' | 'group';
  message: any;
  options?: any;
  delay?: number;
}

export interface ContactCheckResult {
  number: string;
  exists: boolean;
  jid?: string;
  error?: string;
}

export enum WAPresence {
  UNAVAILABLE = 'unavailable',
  AVAILABLE = 'available',
  COMPOSING = 'composing',
  RECORDING = 'recording',
  PAUSED = 'paused'
}

export interface WhatsappMessage {
  id: string;
  sessionId: string;
  remoteJid: string;
  message: any;
  messageTimestamp: number;
  // Add other necessary fields based on your schema
}