/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Context, Next } from '@nocobase/actions';
import { WhatsAppService } from '../services/whatsapp';

export async function list(ctx: Context, next: Next) {
  const whatsappService = ctx.app.getService('whatsapp') as WhatsAppService;
  ctx.body = whatsappService.listSessions();
  await next();
}

export async function create(ctx: Context, next: Next) {
  const whatsappService = ctx.app.getService('whatsapp') as WhatsAppService;
  const { sessionId } = ctx.action.params;

  try {
    const session = await whatsappService.createSession(sessionId);
    ctx.body = { sessionId, status: 'created' };
  } catch (error) {
    ctx.throw(400, error.message);
  }

  await next();
}

export async function destroy(ctx: Context, next: Next) {
  const whatsappService = ctx.app.getService('whatsapp') as WhatsAppService;
  const { sessionId } = ctx.action.params;

  await whatsappService.deleteSession(sessionId);
  ctx.body = { message: 'Session deleted' };

  await next();
}

export async function status(ctx: Context, next: Next) {
  const whatsappService = ctx.app.getService('whatsapp') as WhatsAppService;
  const { sessionId } = ctx.action.params;

  const session = whatsappService.getSession(sessionId);
  if (!session) {
    ctx.throw(404, 'Session not found');
  }

  ctx.body = { status: whatsappService.getSessionStatus(sessionId) };
  await next();
}
