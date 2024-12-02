/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Service } from '@nocobase/server';
import makeWASocket, { DisconnectReason, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
import { SessionService } from './session';
import { logger } from '../utils/logger';

export class WhatsAppService {
  private sessions: Map<string, any>;
  private sessionService: SessionService;
  private retries: Map<string, number>;

  async initialize() {
    this.sessions = new Map();
    this.retries = new Map();
    this.sessionService = this.app.getService('whatsapp.session');
    await this.loadSavedSessions();
  }

  private async loadSavedSessions() {
    const sessions = await this.sessionService.list();
    for (const session of sessions) {
      await this.createSession(session.sessionId);
    }
  }

  async createSession(sessionId: string) {
    if (this.sessions.has(sessionId)) {
      throw new Error('Session already exists');
    }

    const session = await this.sessionService.findById(sessionId);
    const { state, saveCreds } = JSON.parse(session?.data || '{}');

    const socket = makeWASocket({
      printQRInTerminal: true,
      auth: {
        creds: state?.creds || {},
        keys: makeCacheableSignalKeyStore(state?.keys || {}, logger),
      },
      logger,
    });

    socket.ev.on('creds.update', async (creds) => {
      await this.sessionService.update(sessionId, {
        data: JSON.stringify({ state: { creds } }),
      });
    });

    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          await this.createSession(sessionId);
        }
      }
    });

    this.sessions.set(sessionId, socket);
    return socket;
  }

  async deleteSession(sessionId: string) {
    const socket = this.sessions.get(sessionId);
    if (socket) {
      await socket.logout();
      this.sessions.delete(sessionId);
      await this.sessionService.delete(sessionId);
    }
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  listSessions() {
    return Array.from(this.sessions.keys()).map((sessionId) => ({
      sessionId,
      status: this.getSessionStatus(sessionId),
    }));
  }

  private getSessionStatus(sessionId: string) {
    const socket = this.sessions.get(sessionId);
    if (!socket) return 'disconnected';
    return socket.user ? 'connected' : 'connecting';
  }
}

export default WhatsAppService;
