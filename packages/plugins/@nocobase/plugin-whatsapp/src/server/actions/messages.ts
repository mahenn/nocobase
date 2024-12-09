// src/server/actions/message.actions.ts
import { Context } from '@nocobase/actions';
import { WhatsappService } from '../services/whatsapp';

export const messageActions = {
  async send(ctx: Context, next) {
    const { sessionId, jid, type = 'number', message, options } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      const validJid = await service.validJid(session, jid, type);
      if (!validJid) {
        ctx.throw(400, 'Invalid JID');
      }

      await servie.updatePresence(socket, 'composing', jid);
      const result = await scoket.sendMessage(jid, message, options);
      
      ctx.body = result;
    } catch (error) {
      ctx.throw(500, error.message);
    }

    await next();
  },


  async sendBulk(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    const messages = ctx.action.params.messages;
    const { socket, service } = ctx.whatsapp;

    try {
      
      const results = [];
      const errors = [];

      for (const msg of messages) {
        try {
          const validJid = await service.validJid(socket, msg.jid, msg.type || 'number');
          if (!validJid) {
            errors.push({ jid: msg.jid, error: 'Invalid JID' });
            continue;
          }

          if (msg.delay) {
            await new Promise(resolve => setTimeout(resolve, msg.delay));
          }

          await service.updatePresence(socket, 'composing', msg.jid);
          const result = await socket.sendMessage(msg.jid, msg.message, msg.options);
          results.push({ jid: msg.jid, result });
        } catch (error) {
          errors.push({ jid: msg.jid, error: error.message });
        }
      }

      ctx.body = { results, errors };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async deleteForMe(ctx: Context, next) {
    const { sessionId, jid, messageId } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      
      await socket.chatModify({ clear: { messages: [{ id: messageId, fromMe: true }] } }, jid);
      ctx.body = { message: 'Message deleted successfully' };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async deleteForAll(ctx: Context, next) {
    const { sessionId, jid, messageId } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      
      await socket.sendMessage(jid, { delete: { id: messageId, fromMe: true } });
      ctx.body = { message: 'Message deleted for all' };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async download(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    const message = ctx.action.params.message;
    const { socket, service } = ctx.whatsapp;

    try {

      const media = await socket.downloadMediaMessage(message);
      ctx.body = media;
    } catch (error) {
      ctx.throw(500, error.message);
    }

    await next();
  },

  async react(ctx: Context, next) {
    const { sessionId, jid, messageId, emoji } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {
      
      await socket.sendMessage(jid, {
        react: {
          text: emoji,
          key: { id: messageId, fromMe: true }
        }
      });
      ctx.body = { message: 'Reaction sent successfully' };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  }
};