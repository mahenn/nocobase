// src/server/actions/message.actions.ts
import { Context } from '@nocobase/actions';
import { WhatsAppService } from '../services/whatsapp';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { logger } from '../utils/logger';

// Define interfaces for request bodies
interface SendMessageRequest {
  sessionId: string;
  jid: string;
  type?: 'number' | 'group';
  message: any;
  options?: any;
}

interface BulkMessageRequest {
  sessionId: string;
  messages: Array<{
    jid: string;
    type?: 'number' | 'group';
    message: any;
    options?: any;
    delay?: number;
  }>;
}

interface DeleteMessageRequest {
  sessionId: string;
  jid: string;
  messageId: string;
}


export const messageActions = {
  async send(ctx: Context, next) {
    const body = ctx.request.body as SendMessageRequest;
    const { sessionId, jid, type = 'number', message, options } = body;
    
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
    const body = ctx.request.body as BulkMessageRequest;
    const { sessionId } = body;
    const messages = body.messages;
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
    const body = ctx.request.body as DeleteMessageRequest;
    const { sessionId, jid, messageId } = body;
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
    const body = ctx.request.body as DeleteMessageRequest;
    const { sessionId, jid, messageId } = body;
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
    const body = ctx.request.body as SendMessageRequest;
    const message = body.message;

    console.log(message);

    const { socket, service } = ctx.whatsapp;

    try {

      const media = await downloadMediaMessage(message,'buffer');
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