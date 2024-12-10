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

    console.log(socket);
    
    try {

      const results = [];
      
      try {
        const [result] = await socket.onWhatsApp(numbers);
        results.push({
          numbers,
          exists: !!result?.exists,
          jid: result?.jid
        });
      } catch (error) {
        results.push({
          numbers,
          exists: false,
          error: error.message
        });
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

  async listBlocked(ctx: Context, next) {
    const { sessionId, jid } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      const data = await socket.fetchBlocklist();
      ctx.body = { data };
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
  },

  async photo(ctx: Context, next) {
    const { sessionId, jid, type = 'number' } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      const exists = await service.jidExists(sessionId, jid, type);
      if (!exists) {
        ctx.throw(400, 'JID does not exist');
      }

      const url = await socket.profilePictureUrl(jid, 'image');
      ctx.body = { url };
    } catch (error) {
      ctx.throw(500, error.message);
    }

    await next();
  }
};