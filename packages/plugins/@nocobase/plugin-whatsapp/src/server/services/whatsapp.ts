import makeWASocket, { 
  DisconnectReason, 
  isJidBroadcast,
  makeCacheableSignalKeyStore,
  proto
} from '@whiskeysockets/baileys';
import { SessionService } from './session';
import { logger } from '../utils/logger';
import { toDataURL } from 'qrcode';
import type { Boom } from '@hapi/boom';
import { Store } from '../stores/store';
import { useSession } from '../stores/session';


// Define WAStatus enum
enum WAStatus {
  Unknown = 'unknown',
  Connected = 'connected',
  Disconnected = 'disconnected',
  WaitQrcodeAuth = 'wait_qrcode_auth',
  PullingWAData = 'pulling_wa_data',
  Authenticated = 'authenticated'
}

// Define Session type
export type Session = {
  socket: any;
  destroy: () => Promise<void>;
  waStatus?: WAStatus;
};

interface CreateSessionOptions {
  sessionId: string;
  readIncomingMessages?: boolean;
  socketConfig?: any;
}

export class WhatsAppService {
  private sessions: Map<string, Session>;
  private sessionService: SessionService;
  private retries: Map<string, number>;
  private readonly MAX_RECONNECT_RETRIES = 5;
  private readonly RECONNECT_INTERVAL = 3000;
  private app: any;

  constructor(app: any,sessionService: SessionService) {
    this.app = app;
    this.sessionService = sessionService;
    this.sessions = new Map();
    this.retries = new Map();
  }

  async initialize() {
    //this.sessionService = this.app.getService('session');
    await this.loadSavedSessions();
  }

  private async loadSavedSessions() {
    const sessions = await this.sessionService.list();
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

  async createSession(options: CreateSessionOptions) {
    const { sessionId, readIncomingMessages = false, socketConfig } = options;

    if (this.sessions.has(sessionId)) {
      //throw new Error('Session already exists');
    }

    const session = await this.sessionService.findById(sessionId);

    const { state, saveCreds } = await useSession(sessionId, this.app);

    const destroy = async (logout = true) => {
      try {
        const session = this.sessions.get(sessionId);
        if (session) {
          if (logout) await session.socket.logout();
          this.sessions.delete(sessionId);
          await this.sessionService.delete(sessionId);
        }
      } catch (e) {
        logger.error('Error destroying session:', e);
      }
      this.updateWaConnection(sessionId, WAStatus.Disconnected);
    };

    const socket = makeWASocket({
      printQRInTerminal: true,
      generateHighQualityLinkPreview: true,
      ...socketConfig,
      auth: {
        creds: state?.creds || {},
        keys: makeCacheableSignalKeyStore(state?.keys || {}, logger),
      },
      logger,
      shouldIgnoreJid: (jid) => isJidBroadcast(jid),
    });

    const store = new Store(sessionId, socket.ev, this.app);

    socket.ev.on('creds.update', async (creds) => {
      // await this.sessionService.update(sessionId, {
      //   data: JSON.stringify({ state: { creds } }),
      // });
      await saveCreds();
    });

    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        try {
          const qrCode = await toDataURL(qr);
          this.updateWaConnection(sessionId, WAStatus.WaitQrcodeAuth);
          // Store QR code in session data for retrieval via API
          await this.sessionService.update(sessionId, {
            qrCode: JSON.stringify({ qrCode }),
          });
        } catch (e) {
          logger.error('QR generation error:', e);
        }
      }

      if (connection === 'open') {
          await this.app.db.getRepository('sessions').update({
            filter: { 
              sessionId,
            },
            values: { status: 'connected' }
          });
        this.updateWaConnection(sessionId, WAStatus.Connected);
        this.retries.delete(sessionId);
      }

      if (connection === 'close') {
        const shouldReconnect = 
          (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut &&
          this.shouldReconnect(sessionId);

        

        if (shouldReconnect) {
          setTimeout(
            () => this.createSession(options),
            this.RECONNECT_INTERVAL
          );
        } else {
          await destroy();
          await this.app.db.getRepository('sessions').update({
            filter: { 
              sessionId,
            },
            values: { status: 'disconnected' }
          });
        }
      }

      if (connection === 'connecting') {
        this.updateWaConnection(sessionId, WAStatus.PullingWAData);
      }
    });

    if (readIncomingMessages) {
      socket.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (message.key.fromMe || m.type !== 'notify') return;
        await new Promise(resolve => setTimeout(resolve, 1000));
        await socket.readMessages([message.key]);
      });
    }

    const sessionObj: Session = {
      socket,
      store,
      destroy: async () => {
        store.unlisten();
        await socket.logout();
        this.sessions.delete(sessionId);
      },
      waStatus: WAStatus.Unknown,
    };

    this.sessions.set(sessionId, sessionObj);
    
    await this.sessionService.update(sessionId, {
      data: JSON.stringify({ readIncomingMessages, ...socketConfig }),
    });

    return sessionObj;
  }

  async deleteSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      await session.destroy();
    }
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  listSessions() {
    return Array.from(this.sessions.entries()).map(([sessionId, session]) => ({
      sessionId,
      status: session.waStatus || WAStatus.Unknown,
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
}

export default WhatsAppService;