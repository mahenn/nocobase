// packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/contact.ts

import type { BaileysEventEmitter } from '@whiskeysockets/baileys';
import type { BaileysEventHandler } from '../types';
import { logger } from '../../utils/logger';

export default function contactHandler(sessionId: string, event: BaileysEventEmitter, app: any) {
  const repository = app.db.getRepository('contacts');
  let listening = false;

  const set: BaileysEventHandler<'messaging-history.set'> = async ({ contacts }) => {
    try {
      const processedContacts = contacts.map(c => ({
        ...c,
        sessionId
      }));

      for (const contact of processedContacts) {
        await repository.create({
          values: contact,
          filter: {
            id: contact.id,
            sessionId
          }
        });
      }

      logger.info({ newContacts: contacts.length }, 'Synced contacts');
    } catch (e) {
      logger.error(e, 'An error occurred during contacts set');
    }
  };

  const upsert: BaileysEventHandler<'contacts.upsert'> = async (contacts) => {
    try {
      const processedContacts = contacts.map(contact => ({
        ...contact,
        sessionId
      }));

      for (const contact of processedContacts) {
        await repository.create({
          values: contact,
          filter: {
            id: contact.id,
            sessionId
          }
        });
      }
    } catch (e) {
      logger.error(e, 'An error occurred during contacts upsert');
    }
  };

  const update: BaileysEventHandler<'contacts.update'> = async (updates) => {
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
        logger.error(e, 'An error occurred during contact update');
      }
    }
  };

  const listen = () => {
    if (listening) return;

    event.on('messaging-history.set', set);
    event.on('contacts.upsert', upsert);
    event.on('contacts.update', update);
    listening = true;
  };

  const unlisten = () => {
    if (!listening) return;

    event.off('messaging-history.set', set);
    event.off('contacts.upsert', upsert);
    event.off('contacts.update', update);
    listening = false;
  };

  return { listen, unlisten };
}