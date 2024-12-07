// /packages/plugins/@nocobase/plugin-whatsapp/src/server/actions/actions.ts

import { Context, Next } from '@nocobase/actions';

/**
 * Create a new WhatsApp session
 */
export async function createSession(ctx: Context, next: Next) {
  const { sessionId, ...options } = ctx.request.body;
  const session = await ctx.app.whatsappService.createSession({
    sessionId,
    ...options
  });
  ctx.body = { sessionId, status: session.waStatus };
  await next();
}

/**
 * Delete an existing WhatsApp session
 */
export async function deleteSession(ctx: Context, next: Next) {
  const { sessionId } = ctx.params;
  await ctx.app.whatsappService.deleteSession(sessionId);
  ctx.status = 200;
  await next();
}

/**
 * Get status of a WhatsApp session
 */
export async function getStatus(ctx: Context, next: Next) {
  const { sessionId } = ctx.params;
  ctx.body = {
    status: ctx.app.whatsappService.getSessionStatus(sessionId)
  };
  await next();
}

/**
 * List all active WhatsApp sessions
 */
export async function listSessions(ctx: Context, next: Next) {
  ctx.body = ctx.app.whatsappService.listSessions();
  await next();
}

/**
 * Send a message using WhatsApp
 */
export async function sendMessage(ctx: Context, next: Next) {
  const { sessionId } = ctx.params;
  const { jid, content } = ctx.request.body;
  
  // Validate JID before sending
  const validJid = await ctx.app.whatsappService.validJid(sessionId, jid);
  if (!validJid) {
    ctx.throw(400, 'Invalid JID');
    return;
  }

  const result = await ctx.app.whatsappService.sendMessage(sessionId, validJid, content);
  ctx.body = result;
  await next();
}

/**
 * Validate a WhatsApp JID (phone number or group ID)
 */
export async function validateJid(ctx: Context, next: Next) {
  const { sessionId } = ctx.params;
  const { jid, type = 'number' } = ctx.request.body;
  const validJid = await ctx.app.whatsappService.validJid(sessionId, jid, type);
  ctx.body = { valid: !!validJid, jid: validJid };
  await next();
}

// Export all actions as a single object
export const whatsappActions = {
  createSession,
  deleteSession,
  getStatus,
  listSessions,
  sendMessage,
  validateJid
};