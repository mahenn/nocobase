// src/server/actions/message.actions.ts
import { Context } from '@nocobase/actions';
import { WhatsappService } from '../services/whatsapp';
import { updatePresence } from "./misc";
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { logger } from '../utils/logger';

export const messageActions = {
  async send(ctx: Context, next) {
    const { sessionId, jid, type = 'number', message, options } = ctx.request.body;
    const { socket, service } = ctx.whatsapp;

    try {
      const validJid = await service.validJid(sessionId, jid, type);
      console.log(validJid);
      if (!validJid) {
        ctx.throw(400, 'Invalid JID');
      }

      await socket.sendPresenceUpdate('composing', jid);
      const result = await socket.sendMessage(jid, message, options);
      
      ctx.body = result;
    } catch (error) {
      ctx.throw(500, error.message);
    }

    await next();
  },


  async sendBulk(ctx: Context, next) {
    const { sessionId } = ctx.request.body;
    const messages = ctx.request.body.messages;
    const { socket, service } = ctx.whatsapp;

    try {
      
      const results = [];
      const errors = [];

      for (const msg of messages) {
        console.log(sessionId,msg.jid, msg.type || 'number');
        try {
          const validJid = await service.validJid(sessionId, msg.jid, msg.type || 'number');
          if (!validJid) {
            errors.push({ jid: msg.jid, error: 'Invalid JID' });
            continue;
          }

          if (msg.delay) {
            await new Promise(resolve => setTimeout(resolve, msg.delay));
          }

          await socket.sendPresenceUpdate('composing', msg.jid);

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
    const { sessionId, jid, messageId } = ctx.request.body;
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
    const { sessionId, jid, messageId } = ctx.request.body;
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
    const message = ctx.request.body.message;

    console.log(message);

    const { socket, service } = ctx.whatsapp;

    try {

      const media = await downloadMediaMessage(message);
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