// /packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/message.ts

import type { BaileysEventEmitter, WAMessage, MessageUserReceipt, proto } from '@whiskeysockets/baileys';
import { logger } from '../../utils/logger';

export class MessageHandler {
  private listening = false;
  private repository: any;

  constructor(
    private readonly sessionId: string,
    private readonly eventEmitter: BaileysEventEmitter,
    private readonly db: any
  ) {
    this.repository = db.getRepository('messages');
  }

  private processMessage(msg: WAMessage) {
    return {
      sessionId: this.sessionId,
      id: msg.key.id,
      remoteJid: msg.key.remoteJid,
      fromMe: msg.key.fromMe,
      messageTimestamp: msg.messageTimestamp,
      pushName: msg.pushName,
      message: JSON.stringify(msg.message),
      status: msg.status,
      type: msg.type,
      // Add additional fields as needed
    };
  }

  async handleSet({ messages, isLatest }: { messages: WAMessage[], isLatest: boolean }) {
    try {
      if (isLatest) {
        await this.repository.destroy({
          filter: { sessionId: this.sessionId }
        });
      }

      const processedMessages = messages.map(this.processMessage.bind(this));

      for (const message of processedMessages) {
        await this.repository.create({
          values: message,
          filter: {
            id: message.id,
            sessionId: this.sessionId
          }
        });
      }

      logger.info(`Synced ${messages.length} messages`);
    } catch (error) {
      logger.error('Error in handleSet:', error);
    }
  }

  async handleUpsert({ messages, type }: { messages: WAMessage[], type: string }) {
    try {
      const processedMessages = messages.map(msg => ({
        ...this.processMessage(msg),
        type
      }));

      for (const message of processedMessages) {
        await this.repository.create({
          values: message,
          filter: {
            id: message.id,
            sessionId: this.sessionId
          }
        });
      }
    } catch (error) {
      logger.error('Error in handleUpsert:', error);
    }
  }

  async handleUpdate(updates: Partial<WAMessage>[]) {
    for (const update of updates) {
      try {
        if (!update.key?.id) continue;

        await this.repository.update({
          filter: {
            id: update.key.id,
            sessionId: this.sessionId
          },
          values: {
            status: update.status,
            messageStubType: update.messageStubType
          }
        });
      } catch (error) {
        logger.error('Error in handleUpdate:', error);
      }
    }
  }

  async handleDelete(key: { id: string }) {
    try {
      await this.repository.destroy({
        filter: {
          id: key.id,
          sessionId: this.sessionId
        }
      });
    } catch (error) {
      logger.error('Error in handleDelete:', error);
    }
  }

  async handleReceiptUpdate(updates: { key: proto.IMessageKey; receipt: MessageUserReceipt }[]) {
    for (const { key, receipt } of updates) {
      try {
        await this.repository.update({
          filter: {
            id: key.id,
            sessionId: this.sessionId
          },
          values: {
            receiptTimestamp: receipt.t,
            readStatus: receipt.readTimestamp ? 'read' : 'delivered'
          }
        });
      } catch (error) {
        logger.error('Error in handleReceiptUpdate:', error);
      }
    }
  }

  listen() {
    if (this.listening) return;

    this.eventEmitter.on('messaging-history.set', this.handleSet.bind(this));
    this.eventEmitter.on('messages.upsert', this.handleUpsert.bind(this));
    this.eventEmitter.on('messages.update', this.handleUpdate.bind(this));
    this.eventEmitter.on('messages.delete', this.handleDelete.bind(this));
    this.eventEmitter.on('message-receipt.update', this.handleReceiptUpdate.bind(this));

    this.listening = true;
  }

  unlisten() {
    if (!this.listening) return;

    this.eventEmitter.off('messaging-history.set', this.handleSet.bind(this));
    this.eventEmitter.off('messages.upsert', this.handleUpsert.bind(this));
    this.eventEmitter.off('messages.update', this.handleUpdate.bind(this));
    this.eventEmitter.off('messages.delete', this.handleDelete.bind(this));
    this.eventEmitter.off('message-receipt.update', this.handleReceiptUpdate.bind(this));

    this.listening = false;
  }
}