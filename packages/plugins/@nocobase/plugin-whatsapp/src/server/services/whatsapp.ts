// /packages/plugins/@nocobase/plugin-whatsapp/src/server/services/whatsapp.ts

import makeWASocket, { 
  DisconnectReason, 
  isJidBroadcast,
  makeCacheableSignalKeyStore,
  proto,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  WASocket
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { toDataURL } from 'qrcode';
import { Store } from '../stores/store';
import { useSession } from '../stores/session';
import { logger } from '../utils/logger';
import { Gateway } from '../../../../../core/server/src/gateway/index';

// Define WAStatus enum
export enum WAStatus {
  Unknown = 'unknown',
  Connected = 'connected',
  Disconnected = 'disconnected',
  WaitQrcodeAuth = 'wait_qrcode_auth',
  PullingWAData = 'pulling_wa_data',
  Authenticated = 'authenticated'
}

// Define Session type
export type Session = {
  socket: WASocket;
  store: Store;
  destroy: () => Promise<void>;
  waStatus?: WAStatus;
};

interface CreateSessionOptions {
  sessionId: string;
  readIncomingMessages?: boolean;
  socketConfig?: any;
  SSE?: boolean;
}

export class WhatsAppService {
  private sessions: Map<string, Session>;
  private retries: Map<string, number>;
  private readonly MAX_RECONNECT_RETRIES = 5;
  private readonly RECONNECT_INTERVAL = 3000;
  private static SSEQRGenerations = new Map<string, number>();
  private gateway: Gateway;

  constructor(private readonly app: any) {
    this.sessions = new Map();
    this.retries = new Map();
    this.gateway = this.app.getPlugin('users').gateway;
  }

  async initialize() {
    await this.loadSavedSessions();
  }

  private async loadSavedSessions() {
    const repository = this.app.db.getRepository('sessions');
    const sessions = await repository.find();
    for (const session of sessions) {
      const { readIncomingMessages, ...socketConfig } = JSON.parse(session.data || '{}');
      await this.createSession({ 
        sessionId: session.sessionId, 
        readIncomingMessages, 
        socketConfig 
      });
    }
  }

  private updateWaConnection(sessionId: string, waStatus: WAStatus) {
    if (this.sessions.has(sessionId)) {
      const session = this.sessions.get(sessionId)!;
      this.sessions.set(sessionId, { ...session, waStatus });
      this.broadcastToClients('whatsapp.status.update', { sessionId, status: waStatus });
    }
  }

  private shouldReconnect(sessionId: string) {
    let attempts = this.retries.get(sessionId) ?? 0;
    if (attempts < this.MAX_RECONNECT_RETRIES) {
      attempts += 1;
      this.retries.set(sessionId, attempts);
      return true;
    }
    return false;
  }

  private broadcastToClients(event: string, data: any) {
    return;
    const wsServer = this.gateway.wsServer.wss;
    wsServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: event,
          payload: data
        }));
      }
    });
  }

  async createSession(options: CreateSessionOptions) {
    const { sessionId, readIncomingMessages = false, socketConfig, SSE = false } = options;

    console.log("session Id is ",sessionId);

    
    // const existingSession = await this.app.db.getRepository('sessions').findOne({
    //     filter: { sessionId }
    //   });

    //   if (existingSession) {
    //     // Clean up existing session if it's in memory
    //     if (this.sessions.has(sessionId)) {
    //       await this.deleteSession(sessionId);
    //     }
    //   }

    if (this.sessionExists(sessionId)) {
      console.log("found existing seession",sessionId);
      //return this.sessions.get(sessionId);
    }


    const { state, saveCreds } = await useMultiFileAuthState(`./sessions/${sessionId}`);

    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`Using WhatsApp version: ${version.join('.')}, is latest: ${isLatest}`);
    

    const socket = makeWASocket({
      version,
      printQRInTerminal: true,
      generateHighQualityLinkPreview: true,
      //browser: [process.env.BOT_NAME || "NocoBase Bot", "Chrome", "3.0"],
      //version: [2, 3000, 1015901307],
      ...socketConfig,
      auth: {
        creds: state?.creds || {},
        keys: makeCacheableSignalKeyStore(state?.keys || {}, logger),
      },
      logger,
      shouldIgnoreJid: (jid) => isJidBroadcast(jid),
      // Add connection timeout
      connectTimeoutMs: 30000,
      // Add retry settings
      retryRequestDelayMs: 2000
    });


    const store = new Store(sessionId, socket.ev, this.app.db);

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        try {
          const qrCode = await toDataURL(qr);
          this.updateWaConnection(sessionId, WAStatus.WaitQrcodeAuth);
          
          if (SSE) {
            WhatsAppService.SSEQRGenerations.set(sessionId, 
              (WhatsAppService.SSEQRGenerations.get(sessionId) || 0) + 1
            );
          }
          console.log("updating qr code in session ",sessionId);
          await this.app.db.getRepository('sessions').update({
            //filter: { sessionId },
            filterByTk: sessionId,
            values: { 
              qrCode: JSON.stringify({ qrCode }),
              status: WAStatus.WaitQrcodeAuth
            }
          });

          this.broadcastToClients('whatsapp.qr', { sessionId, qrCode });
        } catch (e) {
          logger.error('QR generation error:', e);
        }
      }

      if (connection === 'open') {
        console.log("received open connect for session ",sessionId);
        await this.app.db.getRepository('sessions').update({
          //filter: { sessionId },
          filterByTk: sessionId,
          values: { 
            status: WAStatus.Connected,
            lastConnection: new Date()
          }
        });
        this.updateWaConnection(sessionId, WAStatus.Connected);
        this.retries.delete(sessionId);

      }

      if (connection === 'close') {
          console.log("received close connect for session ",sessionId);
          const shouldReconnect = this.shouldReconnect(sessionId);
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;

        if (statusCode === DisconnectReason.loggedOut) {
            // Handle logout specifically
            await this.deleteSession(sessionId);
            this.updateWaConnection(sessionId, WAStatus.Disconnected);
          } else if (shouldReconnect) {
          setTimeout(
            () => this.createSession(options),
            this.RECONNECT_INTERVAL
          );
        } else {
          await this.deleteSession(sessionId);
          this.updateWaConnection(sessionId, WAStatus.Disconnected);

          await this.app.db.getRepository('sessions').update({
            filter: { sessionId },
            values: { 
              status: WAStatus.Disconnected 
            }
          });
        }
      }

      if (connection === 'connecting') {
        this.updateWaConnection(sessionId, WAStatus.PullingWAData);
      }
    });

    //if (readIncomingMessages) {
      socket.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (message.key.fromMe || m.type !== 'notify') return;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        await socket.readMessages([message.key]);
        
        this.broadcastToClients('whatsapp.message.received', {
          sessionId,
          message: message
        });
      });
   // }

    const session: Session = {
        socket,
        store,
        destroy: async () => {
          socket.ev.removeAllListeners();
          const isConnected = socket.ws?.readyState === WebSocket.OPEN;
          if (isConnected) {
            try {
              await socket.logout();
            } catch (error) {
              logger.warn('Error during logout:', error);
            }
          }
          await socket.end();
        },
        waStatus: WAStatus.Unknown
      };

    this.sessions.set(sessionId, session);
    
    await this.app.db.getRepository('sessions').update({
      filter: { sessionId },
      values: {
        data: JSON.stringify({ readIncomingMessages, ...socketConfig }),
      }
    });

    return session;
  }

  async deleteSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      await session.destroy();
      this.sessions.delete(sessionId);
      this.retries.delete(sessionId);
      WhatsAppService.SSEQRGenerations.delete(sessionId);

       try {
          await this.app.db.getRepository('sessions').update({
            filter: { sessionId },
            values: { 
              status: WAStatus.Disconnected,
              lastConnection: new Date()
            }
          });
        } catch (dbError) {
          logger.error(`Error updating session status in database:`, dbError);
        }
    }
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  sessionExists(sessionId: string) {
    return this.sessions.has(sessionId);
  }

  getSessionStatus(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    const state = ["CONNECTING", "CONNECTED", "DISCONNECTING", "DISCONNECTED"];
    let status = state[(session.socket.ws as WebSocket).readyState];
    status = session.socket.user ? "AUTHENTICATED" : status;
    return session.waStatus !== WAStatus.Unknown ? session.waStatus : status.toLowerCase();
  }

  listSessions() {
    return Array.from(this.sessions.entries()).map(([sessionId, session]) => ({
      sessionId,
      status: this.getSessionStatus(sessionId),
    }));
  }

  async validJid(sessionId: string, jid: string, type: 'group' | 'number' = 'number') {
    const session = this.sessions.get(sessionId);
    if(!session) return null;

    try {
      if (type === 'number') {
        const [result] = await session.socket.onWhatsApp(jid);
        return result?.exists ? result.jid : null;
      }
      const groupMeta = await session.socket.groupMetadata(jid);
      return groupMeta.id || null;
    } catch (e) {
      return null;
    }
  }

  async jidExists(sessionId: string, jid: string, type: 'group' | 'number' = 'number') {
    const validJid = await this.validJid(sessionId, jid, type);
    return !!validJid;
  }

  async sendMessage(sessionId: string, jid: string, content: any) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    try {
      const result = await session.socket.sendMessage(jid, content);
      return result;
    } catch (error) {
      logger.error(`Error sending message for session ${sessionId}:`, error);
      throw error;
    }
  }
}

export default WhatsAppService;