// /packages/plugins/@nocobase/plugin-whatsapp/src/server/handlers/chat.ts

import { BaileysEventEmitter } from '@whiskeysockets/baileys';
import { logger } from '../../utils/logger';

export class ChatHandler {
  private listening = false;
  private repository: any;

  constructor(
    private readonly sessionId: string,
    private readonly eventEmitter: BaileysEventEmitter,
    private readonly db: any
  ) {
    this.repository = db.getRepository('chats');
  }

  async handleSet({ chats, isLatest }: any) {
    try {
      if (isLatest) {
        await this.repository.destroy({
          filter: { sessionId: this.sessionId }
        });
      }

      const processedChats = chats.map((chat: any) => ({
        ...this.transformChat(chat),
        sessionId: this.sessionId
      }));

      await this.repository.create({
        values: processedChats
      });

      logger.info(`Synced ${chats.length} chats`);
    } catch (error) {
      logger.error('Chat sync error:', error);
    }
  }

  private transformChat(chat: any) {
    return {
      id: chat.id,
      name: chat.name,
      unreadCount: chat.unreadCount,
      timestamp: chat.timestamp,
      // Add other relevant fields
    };
  }

  listen() {
    if (this.listening) return;

    this.eventEmitter.on('messaging-history.set', this.handleSet.bind(this));
    this.eventEmitter.on('chats.upsert', this.handleUpsert.bind(this));
    this.eventEmitter.on('chats.update', this.handleUpdate.bind(this));
    this.eventEmitter.on('chats.delete', this.handleDelete.bind(this));

    this.listening = true;
  }

  unlisten() {
    if (!this.listening) return;

    this.eventEmitter.off('messaging-history.set', this.handleSet.bind(this));
    this.eventEmitter.off('chats.upsert', this.handleUpsert.bind(this));
    this.eventEmitter.off('chats.update', this.handleUpdate.bind(this));
    this.eventEmitter.off('chats.delete', this.handleDelete.bind(this));

    this.listening = false;
  }

  // Implement other handlers...
}