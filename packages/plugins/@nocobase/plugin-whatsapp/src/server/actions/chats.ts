// src/server/actions/chat.actions.ts
import { Context, DEFAULT_PAGE, DEFAULT_PER_PAGE, Next } from '@nocobase/actions';
import { WhatsAppService } from '../services/whatsapp';

export const chatActions = {
  async list(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    const { cursor, limit = 25, search } = ctx.action.params;

    try {
      const whereConditions: any = {
       // id: { endsWith: '@s.whatsapp.net' },
        sessionId
      };

      if (search) {
        whereConditions.OR = [
          { name: { contains: String(search) } }
        ];
      }

      const chats = await ctx.db.getRepository('contacts').find({
        filter: whereConditions,
        limit: Number(limit),
        offset: cursor ? 1 : 0,
        //offset: cursor ? { pkId: Number(cursor) } : undefined
      });

      ctx.body = {
        data: chats,
        cursor: chats.length === Number(limit) ? chats[chats.length - 1].pkId : null
      };
    } catch (error) {
      ctx.throw(500, 'An error occurred during chat list');
    }

    await next();
  },

  async messages(ctx: Context, next) {
    const { sessionId, jid } = ctx.action.params;

    console.log(sessionId, jid)
    try {

      const messages = await ctx.db.getRepository('messages').find({
        filter: {
          sessionId,
          remoteJid: jid
        },
        //sort: [{ field: 'messageTimestamp', order: 'desc' }]
      });

      ctx.body = { data: messages };
    } catch (error) {
      ctx.throw(500, error);
    }

    await next();
  }
};