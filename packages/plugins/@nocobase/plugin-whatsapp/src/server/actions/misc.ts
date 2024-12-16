// src/server/actions/misc.actions.ts
import { Context } from '@nocobase/actions';


export const miscActions = {
  async getPhotoURL(ctx: Context, next) {
    const { sessionId, jid, type = 'number' } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {

      const exists = await service.jidExists(socket, jid, type);
      if (!exists) {
        ctx.throw(400, 'JID does not exist');
      }

      const url = await socket.profilePictureUrl(jid, 'image');
      ctx.body = { url };
    } catch (error) {
      ctx.throw(500, error.message);
    }

    await next();
  },

  async updatePresence(ctx: Context, next) {
    const { sessionId, jid, type = 'number', presence } = ctx.action.params;
    const { socket, service } = ctx.whatsapp;

    try {

      const exists = await service.jidExists(socket, jid, type);
      if (!exists) {
        ctx.throw(400, 'JID does not exist');
      }

      await socket.sendPresenceUpdate(presence, jid);
      ctx.body = { message: 'Presence updated successfully' };
    } catch (error) {
      ctx.throw(500, error.message);
    }

    await next();
  }
};