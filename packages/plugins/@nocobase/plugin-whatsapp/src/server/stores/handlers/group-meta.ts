// /packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/groupMetadata.ts

import { BaileysEventEmitter } from '@whiskeysockets/baileys';
import { GroupMetadata, BaileysEventMap } from '@whiskeysockets/baileys';

import { logger } from '../../utils/logger';

interface ExtendedGroupMetadata extends GroupMetadata {
  announceVersionId?: any;
  support?: any;
}

export class GroupMetadataHandler {
  private listening = false;
  private repository: any;

  constructor(
    private readonly sessionId: string,
    private readonly eventEmitter: BaileysEventEmitter,
    private readonly db: any
  ) {
    this.repository = db.getRepository('groupMetadata');
    // Bind methods
    this.handleSet = this.handleSet.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpsert = this.handleUpsert.bind(this);
  }

  private processGroupMetadata(metadata: ExtendedGroupMetadata) {
    return {
      sessionId: this.sessionId,
      id: metadata.id,
      owner: metadata.owner || null,
      subject: metadata.subject || null,
      subjectTime: metadata.subjectTime,
      subjectOwner: metadata.subjectOwner,
      desc: metadata.desc || null,
      descId: metadata.descId || null,
      descOwner: metadata.descOwner || null,
      //descTime: metadata.descTime,
      creation: metadata.creation || null,
      //participants: group.participants ? JSON.stringify(group.participants) : null,
      announceVersionId: metadata.announceVersionId,
      announce: metadata.announce || false,
      //noFrequentlyForwarded: metadata.noFrequentlyForwarded,
      ephemeralDuration: metadata.ephemeralDuration || null,
      memberAddMode: metadata.memberAddMode,
      size: metadata.size || null,
      support: group.support ? JSON.stringify(group.support) : null,
      //suspended: metadata.suspended || false,
      //terminated: metadata.terminated || false,
      restrict: metadata.restrict || false,
      //defaultSubgroup: metadata.defaultSubgroup,
      //parentGroup: metadata.parentGroup,
      //isParentGroup: metadata.isParentGroup || false,
      //isDefaultSubgroup: metadata.isDefaultSubgroup || false,
      //notificationsEnabled: metadata.notificationsEnabled,
      //lastActivityTimestamp: metadata.lastActivityTimestamp,
      //lastSeenActivityTimestamp: metadata.lastSeenActivityTimestamp
    };
  }

  async handleSet(args: BaileysEventMap['messaging-history.set']) {
    const { groupMetadata } = args;
    try {
      //await this.db.sequelize.transaction(async (transaction) => {

        const groups = Object.fromEntries(
          Object.entries(groupMetadata || {}).filter(([_, value]) => value !== undefined)
        );

        //const groups = Object.values(groupMetadata);
        const processedGroups = groups.map(group => this.processGroupMetadata(group));

        for (const group of processedGroups) {
          await this.repository.updateOrCreate({
            values: group,
            filterKeys: ['sessionId', 'id'],
            // filter: {
            //   sessionId_id: {
            //     sessionId: this.sessionId,
            //     id: group.id
            //   }
            // },
            //transaction
          });
        }
      //});

      logger.info(`Synced ${Object.keys(groupMetadata).length} group metadata`);
    } catch (error) {
      logger.error('Group metadata sync error:', error);
    }
  }

  async handleUpsert(groups: GroupMetadata[]) {
    try {
      const processedGroups = groups.map(group => this.processGroupMetadata(group));

      for (const group of processedGroups) {
        await this.repository.updateOrCreate({
          values: group,
          filterKeys: ['sessionId', 'id'],
          // filter: {
          //   sessionId_id: {
          //     sessionId: this.sessionId,
          //     id: group.id
          //   }
          // }
        });
      }
    } catch (error) {
      logger.error('Group metadata upsert error:', error);
    }
  }

  async handleUpdate(updates: Partial<GroupMetadata>[]) {

     if (!Array.isArray(updates)) {
      logger.warn('Updates is not an array:', updates);
      return; // Early return if updates is not an array
    }
    
    for (const update of updates) {
      try {
        // Skip if id is missing
        if (!update?.id) {
          logger.warn('Skipping update - missing id:', update);
          continue;
        }

        // Create a clean update object with only defined values
        const updateValues = {
          ...(update.subject !== undefined && { subject: update.subject }),
          ...(update.desc !== undefined && { desc: update.desc }),
          ...(update.descOwner !== undefined && { descOwner: update.descOwner }),
          ...(update.restrict !== undefined && { restrict: update.restrict }),
          ...(update.announce !== undefined && { announce: update.announce }),
          ...(update.size !== undefined && { size: update.size }),
          ...(update.participants !== undefined && { participants: JSON.stringify(update.participants) }),
          ...(update.ephemeralDuration !== undefined && { ephemeralDuration: update.ephemeralDuration }),
          ...(update.inviteCode !== undefined && { inviteCode: update.inviteCode }),
          ...(update.descId !== undefined && { descId: update.descId }),
         // ...(update.descTime !== undefined && { descTime: update.descTime }),
         // ...(update.groupInviteLink !== undefined && { groupInviteLink: update.groupInviteLink }),
         // ...(update.isParentGroup !== undefined && { isParentGroup: update.isParentGroup }),
          ...(update.memberAddMode !== undefined && { memberAddMode: JSON.stringify(update.memberAddMode) }),
         // ...(update.numSubgroups !== undefined && { numSubgroups: update.numSubgroups }),
         // ...(update.parentGroupId !== undefined && { parentGroupId: update.parentGroupId }),
         // ...(update.support !== undefined && { support: JSON.stringify(update.support) }),
         // ...(update.suspended !== undefined && { suspended: update.suspended }),
         // ...(update.terminatedUserJids !== undefined && { 
         //   terminatedUserJids: JSON.stringify(update.terminatedUserJids) 
         // })
        };

        // Only proceed if there are actual updates
        if (Object.keys(updateValues).length > 0) {
          await this.repository.update({
            filter: {
              id: update.id,
              sessionId: this.sessionId
            },
            values: updateValues
          });
          
          logger.info(`Updated group ${update.id} with values:`, updateValues);
        } else {
          logger.warn(`No valid update values for group ${update.id}`);
        }
      } catch (error) {
        logger.error(`Error updating group ${update?.id}:`, error);
      }
    }
  }

  //not in use for now
  private mergeParticipants(current: any[], updates: any[]) {
    const participantMap = new Map();
    
    // Add current participants to map
    current.forEach(participant => {
      participantMap.set(participant.id, participant);
    });

    // Update or add new participants
    updates.forEach(participant => {
      if (participant.remove) {
        participantMap.delete(participant.id);
      } else {
        participantMap.set(participant.id, {
          ...participantMap.get(participant.id),
          ...participant
        });
      }
    });

    return Array.from(participantMap.values());
  }

  listen() {
    if (this.listening) return;

    this.eventEmitter.on('messaging-history.set', this.handleSet);
    this.eventEmitter.on('groups.update', this.handleUpdate);
    this.eventEmitter.on('group-participants.update', this.handleUpdate);
    this.eventEmitter.on('groups.upsert', this.handleUpsert);

    this.listening = true;
  }

  unlisten() {
    if (!this.listening) return;

    this.eventEmitter.off('messaging-history.set', this.handleSet);
    this.eventEmitter.off('groups.update', this.handleUpdate);
    this.eventEmitter.off('group-participants.update', this.handleUpdate);
    this.eventEmitter.off('groups.upsert', this.handleUpsert);

    this.listening = false;
  }
}