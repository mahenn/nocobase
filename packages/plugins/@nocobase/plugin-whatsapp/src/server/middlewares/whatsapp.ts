// src/server/middlewares/whatsapp.ts

import { Context, Next } from '@nocobase/actions';
import Plugin from '..';

export const whatsAppService = async (ctx: Context, next: Next) => {
  const { sessionId } = ctx.action.params || ctx.request.body;

  
  if (!sessionId) {
    ctx.throw(400, 'Session ID is required');
  }

  try {
    // Get WhatsApp service using the plugin system
    const whatsappService = ctx.app.pm.get(Plugin).whatsappService;
    const session = whatsappService.getSession(sessionId);
    
    
    // Inject into context for use in actions
    ctx.whatsapp = {
      service: whatsappService,
      session: session,
      socket: session.socket
    };

    await next();
  } catch (error) {
    ctx.throw(500, `WhatsApp service error: ${error.message}`);
  }
};