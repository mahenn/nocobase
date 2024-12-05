// packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/message.ts

import type { BaileysEventEmitter, WAMessage } from '@whiskeysockets/baileys';
import type { BaileysEventHandler } from '../types';
import { logger } from '../../utils/logger';

export default function messageHandler(sessionId: string, event: BaileysEventEmitter, app: any) {
  const repository = app.db.getRepository('messages');
  let listening = false;

  const processMessage = (msg: WAMessage) => ({
    ...msg,
    sessionId,
    remoteJid: msg.key.remoteJid,
    id: msg.key.id,
    fromMe: msg.key.fromMe,
    messageTimestamp: msg.messageTimestamp,
    pushName: msg.pushName,
    message: JSON.stringify(msg.message)
  });

  const set: BaileysEventHandler<'messaging-history.set'> = async ({ messages, isLatest }) => {
    try {
      if (isLatest) {
        await repository.destroy({
          filter: { sessionId }
        });
      }

      const processedMessages = messages.map(processMessage);

      for (const message of processedMessages) {
        await repository.create({
          values: message,
          filter: {
            id: message.id,
            sessionId
          }
        });
      }

      logger.info({ messagesAdded: messages.length }, 'Synced messages');
    } catch (e) {
      logger.error(e, 'An error occurred during messages set');
    }
  };

  const upsert: BaileysEventHandler<'messages.upsert'> = async ({ messages, type }) => {
    try {
      const processedMessages = messages.map(processMessage);

      for (const message of processedMessages) {
        await repository.create({
          values: {
            ...message,
            type
          },
          filter: {
            id: message.id,
            sessionId
          }
        });
      }
    } catch (e) {
      logger.error(e, 'An error occurred during messages upsert');
    }
  };

  const update: BaileysEventHandler<'messages.update'> = async (updates) => {
    for (const update of updates) {
      try {
        await repository.update({
          filter: {
            id: update.key.id,
            sessionId
          },
          values: {
            status: update.update.status,
            messageStubType: update.update.messageStubType
          }
        });
      } catch (e) {
        logger.error(e, 'An error occurred during message update');
      }
    }
  };

  const del: BaileysEventHandler<'messages.delete'> = async (item) => {
    try {
      await repository.destroy({
        filter: {
          id: item.key.id,
          sessionId
        }
      });
    } catch (e) {
      logger.error(e, 'An error occurred during message delete');
    }
  };

  const listen = () => {
    if (listening) return;

    event.on('messaging-history.set', set);
    event.on('messages.upsert', upsert);
    event.on('messages.update', update);
    event.on('messages.delete', del);
    listening = true;
  };

  const unlisten = () => {
    if (!listening) return;

    event.off('messaging-history.set', set);
    event.off('messages.upsert', upsert);
    event.off('messages.update', update);
    event.off('messages.delete', del);
    listening = false;
  };

  return { listen, unlisten };
}