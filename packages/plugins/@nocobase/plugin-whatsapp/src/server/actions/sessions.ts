// src/server/actions/session.actions.ts
import { Context } from '@nocobase/actions';
import { WhatsappService } from '../services/whatsapp';

export const sessionActions = {
  async create(ctx: Context, next) {
    try {
      const whatsappService = new WhatsappService();
      const session = await whatsappService.createSession();
      ctx.body = { sessionId: session.id };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async delete(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    try {
      const whatsappService = new WhatsappService();
      await whatsappService.deleteSession(sessionId);
      ctx.body = { message: 'Session deleted successfully' };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async status(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    try {
      const whatsappService = new WhatsappService();
      const status = await whatsappService.getSessionStatus(sessionId);
      ctx.body = { status };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async qr(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    try {
      const whatsappService = new WhatsappService();
      const qr = await whatsappService.getQR(sessionId);
      ctx.body = { qr };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async logout(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    try {
      const whatsappService = new WhatsappService();
      await whatsappService.logout(sessionId);
      ctx.body = { message: 'Logged out successfully' };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  }
};