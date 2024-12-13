/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

// plugins/whatsapp/src/collections/messages.ts
export default {
  name: 'messages',
  createdBy: true,
  updatedBy: true,
  shared: true,
  fields: [
    {
      type: 'bigInt',
      name: 'pkId',
      primaryKey: true,
      autoIncrement: true,
    },
    {
      type: 'string',
      name: 'sessionId',
      length: 128,
      index: true,
    },
    {
      type: 'string',
      name: 'remoteJid',
      length: 128,
    },
    {
      type: 'string',
      name: 'id',
      length: 128,
    },
    {
      type: 'json',
      name: 'key',
    },
    {
      type: 'json',
      name: 'message',
    },
    {
      type: 'bigInt',
      name: 'messageTimestamp',
    },
    {
      type: 'string',
      name: 'pushName',
      length: 128,
    },
    {
      type: 'string',
      name: 'participant',
      length: 128,
    },
    {
      type: 'integer',
      name: 'status',
    },
    {
      type: 'integer',
      name: 'messageStubType',
    },
    {
      type: 'json',
      name: 'reactions',
    },
    {
      type: 'json',
      name: 'userReceipt',
    },
    {
      type: 'json',
      name: 'mediaData',
    },
    {
      type: 'boolean',
      name: 'broadcast',
    },
    {
      type: 'boolean',
      name: 'clearMedia',
    },
    {
      type: 'integer',
      name: 'duration',
    },
    {
      type: 'json',
      name: 'ephemeralOutOfSync',
    },
    {
      type: 'string',
      name: 'ephemeralStartTimestamp',
      length: 128,
    },
    {
      type: 'json',
      name: 'labels',
    },
    {
      type: 'string',
      name: 'mediaKeyTimestamp',
      length: 128,
    },
    {
      type: 'integer',
      name: 'mediaCiphertextSha256',
    },
    {
      type: 'string',
      name: 'mediaEncSha256',
      length: 128,
    },
    {
      type: 'string',
      name: 'messageC2STimestamp',
      length: 128,
    },
    {
      type: 'boolean',
      name: 'multicast',
    },
    {
      type: 'string',
      name: 'originalSelfAuthorUserJid',
      length: 128,
    },
    {
      type: 'json',
      name: 'paymentInfo',
    },
    {
      type: 'boolean',
      name: 'finalLiveLocation',
    },
    {
      type: 'json',
      name: 'quotedPaymentInfo',
    },
    {
      type: 'json',
      name: 'quotedStickerData',
    },
    {
      type: 'string',
      name: 'serverToken',
      length: 128,
    },
    {
      type: 'json',
      name: 'statusAlreadyViewed',
    },
    {
      type: 'string',
      name: 'messageSecret',
      length: 128,
    },
    {
      type: 'integer',
      name: 'starred',
    },
    {
      type: 'json',
      name: 'viewOnceMessage',
    },
    {
      type: 'belongsTo',
      name: 'chat',
      target: 'chats',
      foreignKey: 'remoteJid',
      targetKey: 'id',
    },
    {
      type: 'belongsTo',
      name: 'session',
      target: 'sessions',
      foreignKey: 'sessionId',
      targetKey: 'sessionId',
    },
  ],
  indexes: [
    {
      unique: true,
      fields: ['sessionId', 'remoteJid', 'id'],
    },
    {
      fields: ['sessionId'],
    },
  ],
};
