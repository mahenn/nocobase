// src/server/actions/group.actions.ts
import { Context } from '@nocobase/actions';
import { WhatsappService } from '../services/whatsapp';

export const groupActions = {
  async list(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    const { cursor, limit = 25, search } = ctx.action.params;

    try {
      const whereConditions: any = {
        id: { endsWith: '@g.us' },
        sessionId
      };

      if (search) {
        whereConditions.OR = [
          { name: { contains: String(search) } }
        ];
      }

      const groups = await ctx.db.getRepository('contacts').find({
        filter: whereConditions,
        take: Number(limit),
        skip: cursor ? 1 : 0,
        cursor: cursor ? { pkId: Number(cursor) } : undefined
      });

      ctx.body = {
        data: groups,
        cursor: groups.length === Number(limit) ? groups[groups.length - 1].pkId : null
      };
    } catch (error) {
      ctx.throw(500, 'An error occurred during group list');
    }

    await next();
  },

  async find(ctx: Context, next) {
    const { sessionId, jid } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      
      const data = await socket.groupMetadata(jid);
      ctx.body = { data };
    } catch (error) {
      ctx.throw(500, 'An error occurred during group metadata fetch');
    }

    await next();
  },

  async create(ctx: Context, next) {
    const { sessionId, subject, participants } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;
    try {
      

      if (!Array.isArray(participants) || participants.length < 1) {
        ctx.throw(400, 'Participants must be an array and have at least 1 member');
      }

      if (subject.length > 100) {
        ctx.throw(400, 'Subject must be less than 100 characters');
      }

      const listNumbersNotExists: string[] = [];
      for (const participant of participants) {
        const exists = await service.jidExists(socket, participant);
        if (!exists) {
          listNumbersNotExists.push(participant);
        }
      }

      const data = await socket.groupCreate(subject, participants);
      ctx.body = {
        data,
        error: listNumbersNotExists.length > 0 
          ? `The following numbers do not exist: ${listNumbersNotExists.join(', ')}`
          : null
      };
    } catch (error) {
      ctx.throw(500, 'An error occurred during group creation');
    }

    await next();
  },

  async updateParticipants(ctx: Context, next) {
    const { sessionId, jid } = ctx.action.params;
    const { participants, action = 'add' } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {

      if (!Array.isArray(participants) || participants.length < 1) {
        ctx.throw(400, 'Participants must be an array and have at least 1 member');
      }

      const listNumbersNotExists: string[] = [];
      for (const participant of participants) {
        const exists = await service.jidExists(socket, participant);
        if (!exists) {
          listNumbersNotExists.push(participant);
        }
      }

      const data = await socket.groupParticipantsUpdate(jid, participants, action);
      ctx.body = {
        data,
        error: listNumbersNotExists.length > 0
          ? `The following numbers do not exist: ${listNumbersNotExists.join(', ')}`
          : null
      };
    } catch (error) {
      ctx.throw(500, 'An error occurred during group participants update');
    }

    await next();
  },

  async updateSubject(ctx: Context, next) {
    const { sessionId, jid, subject } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {

      if (subject.length > 100) {
        ctx.throw(400, 'Subject must be less than 100 characters');
      }

      await socket.groupUpdateSubject(jid, subject);
      ctx.body = { message: 'Group subject updated' };
    } catch (error) {
      ctx.throw(500, 'An error occurred during group subject update');
    }

    await next();
  },

  async updateSetting(ctx: Context, next) {
    const { sessionId, jid, action } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      await socket.groupSettingUpdate(jid, action);
      ctx.body = { message: 'Group setting updated' };
    } catch (error) {
      ctx.throw(500, 'An error occurred during group setting update');
    }

    await next();
  },

  async leave(ctx: Context, next) {
    const { sessionId, jid } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      await socket.groupLeave(jid);
      ctx.body = { message: 'Group left successfully' };
    } catch (error) {
      ctx.throw(500, 'An error occurred during group leave');
    }

    await next();
  }
};