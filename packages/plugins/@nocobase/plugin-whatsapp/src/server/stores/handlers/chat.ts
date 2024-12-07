// /packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/chat.ts

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
    // Bind methods in constructor
    this.handleSet = this.handleSet.bind(this);
    this.handleUpsert = this.handleUpsert.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleSet({ chats, isLatest }: { chats: any[], isLatest: boolean }) {
    try {
      if (isLatest) {
        await this.repository.destroy({
          filter: { sessionId: this.sessionId }
        });
      }

      // // Get existing chat IDs
      // const existingChats = await this.repository.find({
      //   filter: {
      //     id: { $in: chats.map(c => c.id) },
      //     sessionId: this.sessionId
      //   }
      // });
      // const existingIds = existingChats.map(c => c.id);

      // Process only new chats
      const processedChats = chats
        //.filter(c => !existingIds.includes(c.id))
        .map(chat => ({
          sessionId: this.sessionId,
          id: chat.id,
          name: chat.name,
          unreadCount: chat.unreadCount,
          //timestamp: chat.timestamp,
          conversationTimestamp: chat.conversationTimestamp,
          archived: chat.archived,
          pinned: chat.pinned,
          ephemeralExpiration: chat.ephemeralExpiration,
          ephemeralSettingTimestamp: chat.ephemeralSettingTimestamp,
          mute: chat.mute,
          notSpam: chat.notSpam
        }));

      if (processedChats.length > 0) {
        await this.repository.updateOrCreate({
          values: processedChats,
          filterKeys: ['sessionId', 'id'],
        });
      }

      logger.info(`Synced ${processedChats.length} chats`);
    } catch (error) {
      logger.error('Chat sync error:', error);
    }
  }

  async handleUpsert(chats: any[]) {
    try {
      const results = [];
      for (const chat of chats) {
        const data = {
          sessionId: this.sessionId,
          id: chat.id,
          name: chat.name,
          unreadCount: chat.unreadCount,
          //timestamp: chat.timestamp,
          conversationTimestamp: chat.conversationTimestamp
        };

        await this.repository.updateOrCreate({
          values: data,
          filterKeys: ['sessionId', 'id'],
          // filter: {
          //   sessionId_id: { id: chat.id, sessionId: this.sessionId }
          // }
        });
        results.push(data);
      }
    } catch (error) {
      logger.error('Chat upsert error:', error);
    }
  }

  async handleUpdate(updates: any[]) {
    for (const update of updates) {

      console.log("chat data here",update);

      try {
        if (!update.id) continue;

        // const existingChat = await this.repository.findOne({
        //   filter: { 
        //     id: update.id,
        //     sessionId: this.sessionId 
        //   }
        // });

        // if (!existingChat) {
        //   logger.info('Chat not found, skipping update');
        //   continue;
        // }

        await this.repository.updateOrCreate({
          // filter: { 
          //   id: update.id,
          //   sessionId: this.sessionId 
          // },
          filterKeys: ['sessionId', 'id'],
          values: {
            ...update,
            unreadCount: typeof update.unreadCount === 'number' 
              ? update.unreadCount 
              : existingChat.unreadCount
          }
        });
      } catch (error) {
        logger.error('Chat update error:', error);
      }
    }
  }

  async handleDelete(ids: string[]) {
    try {
      await this.repository.destroy({
        filter: {
          id: { $in: ids },
          sessionId: this.sessionId
        }
      });
    } catch (error) {
      logger.error('Chat delete error:', error);
    }
  }

  listen() {
    if (this.listening) return;

    this.eventEmitter.on('messaging-history.set', this.handleSet);
    this.eventEmitter.on('chats.upsert', this.handleUpsert);
    this.eventEmitter.on('chats.update', this.handleUpdate);
    this.eventEmitter.on('chats.delete', this.handleDelete);

    this.listening = true;
  }

  unlisten() {
    if (!this.listening) return;

    this.eventEmitter.off('messaging-history.set', this.handleSet);
    this.eventEmitter.off('chats.upsert', this.handleUpsert);
    this.eventEmitter.off('chats.update', this.handleUpdate);
    this.eventEmitter.off('chats.delete', this.handleDelete);

    this.listening = false;
  }
}