// src/server/actions/session.actions.ts
import { Context } from '@nocobase/actions';
import { WhatsappService } from '../services/whatsapp';

export const sessionActions = {

  async create(ctx: Context, next) {
    try {
      const { sessionId } = ctx.action.params;
      const { service } = ctx.whatsapp;

      //insert sessionId into session 
      await ctx.db.getRepository('sessions').create({
        values: {
          sessionId,
        },
        filterKeys: ['sessionId'],
      });

      const session = await service.createSession({ sessionId });

      ctx.body = { sessionId: session.id };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async delete(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;
    try {
      await service.deleteSession(sessionId);
      ctx.body = { message: 'Session deleted successfully' };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async status(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;
    try {
      const status = await service.getSessionStatus(sessionId);
      ctx.body = { status };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async qr(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;
    try {
      const qr = await service.getQR(sessionId);
      ctx.body = { qr };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  },

  async logout(ctx: Context, next) {
    const { sessionId } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;
    try {
      await service.deleteSession(sessionId);
      ctx.body = { message: 'Logged out successfully' };
    } catch (error) {
      ctx.throw(500, error.message);
    }
    await next();
  }

};