// src/server/actions/contact.actions.ts
import { Context } from '@nocobase/actions';
import { WhatsappService } from '../services/whatsapp';
import Plugin from '..';

export const contactActions = {
  async list(ctx: Context, next) {
    const {sessionId} = ctx.action.params;
    const { cursor, limit = 5, search } = ctx.action.params;

    try {
      const whereConditions: any = {
        sessionId
      };

      if (search) {
        whereConditions.OR = [
          { name: { contains: String(search) } },
          { verifiedName: { contains: String(search) } },
          { notify: { contains: String(search) } }
        ];
      }

      const contacts = await ctx.db.getRepository('contacts').find({
        filter: whereConditions,
        take: Number(limit),
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined
      });

      ctx.body = {
        data: contacts,
        cursor: contacts.length === Number(limit) ? contacts[contacts.length - 1].id : null
      };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async check(ctx: Context, next) {
    
    const { sessionId, numbers } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;
    
    try {
      // const whatsappService = ctx.app.pm.get(Plugin).whatsappService;
      // const session = whatsappService.getSession(sessionId).socket;
      
      const results = [];
      for (const number of numbers) {
        try {
          const [result] = await socket.onWhatsApp(number);
          results.push({
            number,
            exists: !!result?.exists,
            jid: result?.jid
          });
        } catch (error) {
          results.push({
            number,
            exists: false,
            error: error.message
          });
        }
      }

      ctx.body = { results };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async block(ctx: Context, next) {
    const { sessionId, jid } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      await socket.updateBlockStatus(jid, "block");
      ctx.body = { message: 'Contact blocked successfully' };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async unblock(ctx: Context, next) {
    const { sessionId, jid } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      await socket.updateBlockStatus(jid, "unblock");
      ctx.body = { message: 'Contact unblocked successfully' };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  }
};