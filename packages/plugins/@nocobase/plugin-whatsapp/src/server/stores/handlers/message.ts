// /packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/message.ts

import { BaileysEventEmitter, WAMessage } from '@whiskeysockets/baileys';
import { logger } from '../../utils/logger';
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import { writeFile } from 'fs/promises'

export class MessageHandler {
  private listening = false;
  private repository: any;

  constructor(
    private readonly sessionId: string,
    private readonly eventEmitter: BaileysEventEmitter,
    private readonly db: any
  ) {
    this.repository = db.getRepository('messages');
    // Bind methods
    this.handleSet = this.handleSet.bind(this);
    this.handleUpsert = this.handleUpsert.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  private processMessage(msg: WAMessage) {
    // Extract basic message info
    const baseMessage = {
      sessionId: this.sessionId,
      id: msg.key.id,
      remoteJid: msg.key.remoteJid,
      fromMe: msg.key.fromMe,
      messageTimestamp: msg.messageTimestamp,
      pushName: msg.pushName,
    };

    // Extract message key
    const key = {
      remoteJid: msg.key.remoteJid,
      fromMe: msg.key.fromMe,
      id: msg.key.id,
      participant: msg.key.participant
    };

    // Process additional fields
    const additionalFields = {
      key: key,
      message: msg.message ? JSON.stringify(msg.message) : null,
      messageStubType: msg.messageStubType,
      messageStubParameters: msg.messageStubParameters ? JSON.stringify(msg.messageStubParameters) : null,
      participant: msg.key.participant,
      userReceipt: msg.userReceipt ? JSON.stringify(msg.userReceipt) : null,
      reactions: msg.reactions ? JSON.stringify(msg.reactions) : null,
      // Add other fields from the schema
      broadcast: msg.broadcast || false,
      clearMedia: msg.clearMedia || false,
      duration: msg.duration,
      ephemeralOutOfSync: msg.ephemeralOutOfSync ? JSON.stringify(msg.ephemeralOutOfSync) : null,
      ephemeralStartTimestamp: msg.ephemeralStartTimestamp ? String(msg.ephemeralStartTimestamp) : null,
      labels: msg.labels ? JSON.stringify(msg.labels) : null,
      mediaKeyTimestamp: msg.mediaKeyTimestamp,
      mediaCiphertextSha256: msg.mediaCiphertextSha256 ? Number(msg.mediaCiphertextSha256) : null,
      mediaEncSha256: msg.mediaEncSha256,
      messageC2STimestamp: msg.messageC2STimestamp ? String(msg.messageC2STimestamp) : null,
      multicast: msg.multicast || false,
      originalSelfAuthorUserJid: msg.originalSelfAuthorUserJid,
      paymentInfo: msg.paymentInfo ? JSON.stringify(msg.paymentInfo) : null,
      finalLiveLocation: msg.finalLiveLocation || false,
      quotedPaymentInfo: msg.quotedPaymentInfo ? JSON.stringify(msg.quotedPaymentInfo) : null,
      quotedStickerData: msg.quotedStickerData ? JSON.stringify(msg.quotedStickerData) : null,
      serverToken: msg.serverToken,
      status: msg.status,
      statusAlreadyViewed: msg.statusAlreadyViewed ? JSON.stringify(msg.statusAlreadyViewed) : null,
      messageSecret: msg.messageSecret,
      starred: msg.starred,
      viewOnceMessage: msg.viewOnceMessage ? JSON.stringify(msg.viewOnceMessage) : null,
      verifiedBizName: msg.verifiedBizName || null,

    };

    return {
      ...baseMessage,
      ...additionalFields
    };
  }

  async handleSet({ messages, isLatest }: { messages: WAMessage[], isLatest: boolean }) {
    console.log("handle set ",messages);
    try {

      if (!Array.isArray(messages)) {
        logger.error('Invalid messages format in handleSet: messages is not an array');
        return;
      }


     // await this.db.sequelize.transaction(async (transaction) => {
        if (isLatest) {
          await this.repository.destroy({
            filter: { sessionId: this.sessionId }
          });
        }

      const processedMessages = messages.map(this.processMessage.bind(this));

        for (const message of processedMessages) {
        await this.repository.updateOrCreate({
          values: message,
          filterKeys: ['sessionId', 'id','remoteJid'],
          // filter: {
          //   id: message.id,
          //   sessionId: this.sessionId
          // }
        });

      }

      //   await this.repository.create({
      //     values: processedMessages,
      //     transaction
      //   });
     //  });

      logger.info(`Synced ${messages.length} messages`);
    } catch (error) {
      logger.error('Message sync error:', error);
    }
  }

  async handleUpsert(data: { messages: WAMessage[], type: string }) {
    console.log("handle upsert ",data);
    try {

      if (!Array.isArray(data.messages) || !data.messages.length) {
        logger.warn('No messages to process in handleUpsert');
        console.log("No messages to process in handleUpsert ",);
        return;
      }
      console.log("handle upsert adding ... ",);

      const processedMessages = data.messages.map(msg => ({
      ...this.processMessage(msg),
      type: data.type
    }));

      for (const message of processedMessages) {
        await this.repository.updateOrCreate({
          values: message,
          filterKeys: ['sessionId', 'id','remoteJid'],
          // filter: {
          //   sessionId: this.sessionId,
          //   remoteJid: message.remoteJid,
          //   id: message.id
          // }
        });
      }


      for (const msg of data.messages)
      {
        console.log(msg,Object.keys (msg.message)['0']);

        const messageType = Object.keys (msg.message)[0]// get what type of message it is -- text, image, video
        // if the message is an image
        //below codes working we need to now download all images, video & audio
        // if (messageType === 'imageMessage') {
        //     // download the message
        //     const buffer = await downloadMediaMessage(
        //         msg,
        //         'buffer',
        //         { },
        //         { 
        //             logger,
        //             // pass this so that baileys can request a reupload of media
        //             // that has been deleted
        //             //reuploadRequest: sock.updateMediaMessage
        //         }
        //     )
        //     // save to file
        //     await writeFile('./my-download.jpeg', buffer)
        // }

      }


       logger.info(`Upserted ${processedMessages.length} messages`);
    } catch (error) {
      logger.error('Message upsert error:', error);
    }
  }

  async handleUpdate(updates: Partial<WAMessage>[]) {
    try {
      for (const update of updates) {
        if (!update.key?.id || !update.key?.remoteJid) continue;

        await this.repository.update({
          filter: {
            sessionId: this.sessionId,
            remoteJid: update.key.remoteJid,
            id: update.key.id
          },
          values: update
        });
      }
    } catch (error) {
      logger.error('Message update error:', error);
    }
  }

  async handleDelete(messageKeys: { id: string; remoteJid: string; }[]) {
    try {
      for (const key of messageKeys) {
        await this.repository.destroy({
          filter: {
            sessionId: this.sessionId,
            remoteJid: key.remoteJid,
            id: key.id
          }
        });
      }
    } catch (error) {
      logger.error('Message delete error:', error);
    }
  }

  listen() {
    if (this.listening) return;

    this.eventEmitter.on('messaging-history.set', this.handleSet);
    this.eventEmitter.on('messages.upsert', this.handleUpsert);
    this.eventEmitter.on('messages.update', this.handleUpdate);
    this.eventEmitter.on('messages.delete', this.handleDelete);

    this.listening = true;
  }

  unlisten() {
    if (!this.listening) return;

    this.eventEmitter.off('messaging-history.set', this.handleSet);
    this.eventEmitter.off('messages.upsert', this.handleUpsert);
    this.eventEmitter.off('messages.update', this.handleUpdate);
    this.eventEmitter.off('messages.delete', this.handleDelete);

    this.listening = false;
  }
}