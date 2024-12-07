// /packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/group-meta.ts

import type { BaileysEventEmitter, GroupMetadata } from '@whiskeysockets/baileys';
import { logger } from '../../utils/logger';

export class GroupMetadataHandler {
  private listening = false;
  private repository: any;

  constructor(
    private readonly sessionId: string,
    private readonly eventEmitter: BaileysEventEmitter,
    private readonly db: any
  ) {
    this.repository = db.getRepository('groups');
  }

  private processGroupMetadata(group: GroupMetadata) {
    return {
      sessionId: this.sessionId,
      id: group.id,
      subject: group.subject,
      creation: group.creation,
      owner: group.owner,
      desc: group.desc,
      participants: JSON.stringify(group.participants),
      ephemeralDuration: group.ephemeralDuration
    };
  }

  async handleUpsert(groups: GroupMetadata[]) {
    try {
      const processedGroups = groups.map(this.processGroupMetadata.bind(this));

      for (const group of processedGroups) {
        await this.repository.create({
          values: group,
          filter: {
            id: group.id,
            sessionId: this.sessionId
          }
        });
      }
    } catch (error) {
      logger.error('Error in handleUpsert:', error);
    }
  }

  async handleUpdate(updates: Partial<GroupMetadata>[]) {
    for (const update of updates) {
      try {
        if (!update.id) continue;

        await this.repository.update({
          filter: {
            id: update.id,
            sessionId: this.sessionId
          },
          values: update
        });
      } catch (error) {
        logger.error('Error in handleUpdate:', error);
      }
    }
  }

  async handleParticipantsUpdate({ id, participants, action }: { 
    id: string, 
    participants: string[], 
    action: 'add' | 'remove' | 'promote' | 'demote' 
  }) {
    try {
      const group = await this.repository.findOne({
        filter: {
          id,
          sessionId: this.sessionId
        }
      });

      if (!group) {
        logger.info(`Group ${id} not found for participants update`);
        return;
      }

      const currentParticipants = JSON.parse(group.participants || '[]');
      let updatedParticipants;

      switch (action) {
        case 'add':
          updatedParticipants = [
            ...currentParticipants,
            ...participants.map(jid => ({ id: jid, isAdmin: false }))
          ];
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

      await this.repository.update({
        filter: {
          id,
          sessionId: this.sessionId
        },
        values: {
          participants: JSON.stringify(updatedParticipants)
        }
      });
    } catch (error) {
      logger.error('Error in handleParticipantsUpdate:', error);
    }
  }

  listen() {
    if (this.listening) return;

    this.eventEmitter.on('groups.upsert', this.handleUpsert.bind(this));
    this.eventEmitter.on('groups.update', this.handleUpdate.bind(this));
    this.eventEmitter.on('group-participants.update', this.handleParticipantsUpdate.bind(this));

    this.listening = true;
  }

  unlisten() {
    if (!this.listening) return;

    this.eventEmitter.off('groups.upsert', this.handleUpsert.bind(this));
    this.eventEmitter.off('groups.update', this.handleUpdate.bind(this));
    this.eventEmitter.off('group-participants.update', this.handleParticipantsUpdate.bind(this));

    this.listening = false;
  }
}