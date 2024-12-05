// packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/chat.ts

import type { BaileysEventEmitter } from '@whiskeysockets/baileys';
import type { BaileysEventHandler } from '../types';
import { logger } from '../../utils/logger';

export default function chatHandler(sessionId: string, event: BaileysEventEmitter, app: any) {
  const repository = app.db.getRepository('chats');
  let listening = false;

  const set: BaileysEventHandler<'messaging-history.set'> = async ({ chats, isLatest }) => {
    try {
      if (isLatest) {
        await repository.destroy({
          filter: { sessionId }
        });
      }

      const existingChats = await repository.find({
        filter: {
          id: { $in: chats.map(c => c.id) },
          sessionId
        }
      });

      const existingIds = existingChats.map(c => c.id);
      const processedChats = chats
        .filter(c => !existingIds.includes(c.id))
        .map(c => ({
          ...c,
          sessionId
        }));

      if (processedChats.length > 0) {
        await repository.create({
          values: processedChats
        });
      }

      logger.info({ chatsAdded: processedChats.length }, 'Synced chats');
    } catch (e) {
      logger.error(e, 'An error occurred during chats set');
    }
  };

  const upsert: BaileysEventHandler<'chats.upsert'> = async (chats) => {
    try {
      for (const chat of chats) {
        await repository.create({
          values: {
            ...chat,
            sessionId
          },
          filter: {
            id: chat.id,
            sessionId
          }
        });
      }
    } catch (e) {
      logger.error(e, 'An error occurred during chats upsert');
    }
  };

  const update: BaileysEventHandler<'chats.update'> = async (updates) => {
    for (const update of updates) {
      try {
        await repository.update({
          filter: {
            id: update.id,
            sessionId
          },
          values: update
        });
      } catch (e) {
        logger.error(e, 'An error occurred during chat update');
      }
    }
  };

  const del: BaileysEventHandler<'chats.delete'> = async (ids) => {
    try {
      await repository.destroy({
        filter: {
          id: { $in: ids },
          sessionId
        }
      });
    } catch (e) {
      logger.error(e, 'An error occurred during chats delete');
    }
  };

  const listen = () => {
    if (listening) return;

    event.on('messaging-history.set', set);
    event.on('chats.upsert', upsert);
    event.on('chats.update', update);
    event.on('chats.delete', del);
    listening = true;
  };

  const unlisten = () => {
    if (!listening) return;

    event.off('messaging-history.set', set);
    event.off('chats.upsert', upsert);
    event.off('chats.update', update);
    event.off('chats.delete', del);
    listening = false;
  };

  return { listen, unlisten };
}