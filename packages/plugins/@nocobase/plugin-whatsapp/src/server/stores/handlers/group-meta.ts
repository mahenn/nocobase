// packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/group-meta.ts

import type { BaileysEventEmitter } from '@whiskeysockets/baileys';
import type { BaileysEventHandler } from '../types';
import { logger } from '../../utils/logger';

export default function groupMetadataHandler(sessionId: string, event: BaileysEventEmitter, app: any) {
  const repository = app.db.getRepository('groups');
  let listening = false;

  const processGroupMetadata = (groupMetadata: any) => ({
    ...groupMetadata,
    sessionId,
    id: groupMetadata.id,
    subject: groupMetadata.subject,
    creation: groupMetadata.creation,
    owner: groupMetadata.owner,
    participants: JSON.stringify(groupMetadata.participants),
    ephemeralDuration: groupMetadata.ephemeralDuration
  });

  const update: BaileysEventHandler<'groups.update'> = async (updates) => {
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
        logger.error(e, 'An error occurred during group update');
      }
    }
  };

  const upsert: BaileysEventHandler<'groups.upsert'> = async (groupMetadata) => {
    try {
      const processedGroups = groupMetadata.map(processGroupMetadata);

      for (const group of processedGroups) {
        await repository.create({
          values: group,
          filter: {
            id: group.id,
            sessionId
          }
        });
      }
    } catch (e) {
      logger.error(e, 'An error occurred during group upsert');
    }
  };

  const updateParticipants: BaileysEventHandler<'group-participants.update'> = async ({ id, participants, action }) => {
    try {
      const group = await repository.findOne({
        filter: {
          id,
          sessionId
        }
      });

      if (!group) return;

      const currentParticipants = JSON.parse(group.participants || '[]');
      let updatedParticipants;

      switch (action) {
        case 'add':
          updatedParticipants = [...currentParticipants, ...participants.map(jid => ({ id: jid, isAdmin: false }))];
          break;
        case 'remove':
          updatedParticipants = currentParticipants.filter(p => !participants.includes(p.id));
          break;
        case 'promote':
        case 'demote':
          updatedParticipants = currentParticipants.map(p => ({
            ...p,
            isAdmin: action === 'promote' ? participants.includes(p.id) : !participants.includes(p.id)
          }));
          break;
      }

      await repository.update({
        filter: {
          id,
          sessionId
        },
        values: {
          participants: JSON.stringify(updatedParticipants)
        }
      });
    } catch (e) {
      logger.error(e, 'An error occurred during group participants update');
    }
  };

  const listen = () => {
    if (listening) return;

    event.on('groups.upsert', upsert);
    event.on('groups.update', update);
    event.on('group-participants.update', updateParticipants);
    listening = true;
  };

  const unlisten = () => {
    if (!listening) return;

    event.off('groups.upsert', upsert);
    event.off('groups.update', update);
    event.off('group-participants.update', updateParticipants);
    listening = false;
  };

  return { listen, unlisten };
}