/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { defineCollection } from '@nocobase/database';

// plugins/whatsapp/src/collections/chats.ts
export default defineCollection({
  name: 'chats',
  createdBy: true,
  updatedBy: true,
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
      type: 'boolean',
      name: 'archived',
    },
    {
      type: 'json',
      name: 'contactPrimaryIdentityKey',
    },
    {
      type: 'bigInt',
      name: 'conversationTimestamp',
    },
    {
      type: 'string',
      name: 'createdBy',
      length: 128,
    },
    {
      type: 'string',
      name: 'description',
      length: 500,
    },
    {
      type: 'json',
      name: 'disappearingMode',
    },
    {
      type: 'string',
      name: 'displayName',
      length: 128,
    },
    {
      type: 'boolean',
      name: 'endOfHistoryTransfer',
    },
    {
      type: 'integer',
      name: 'endOfHistoryTransferType',
    },
    {
      type: 'integer',
      name: 'ephemeralExpiration',
    },
    {
      type: 'bigInt',
      name: 'ephemeralSettingTimestamp',
    },
    {
      type: 'string',
      name: 'id',
      length: 128,
    },
    {
      type: 'boolean',
      name: 'isDefaultSubgroup',
    },
    {
      type: 'boolean',
      name: 'isParentGroup',
    },
    {
      type: 'bigInt',
      name: 'lastMsgTimestamp',
    },
    {
      type: 'string',
      name: 'lidJid',
      length: 128,
    },
    {
      type: 'boolean',
      name: 'markedAsUnread',
    },
    {
      type: 'integer',
      name: 'mediaVisibility',
    },
    {
      type: 'json',
      name: 'messages',
    },
    {
      type: 'bigInt',
      name: 'muteEndTime',
    },
    {
      type: 'string',
      name: 'name',
      length: 128,
    },
    {
      type: 'string',
      name: 'newJid',
      length: 128,
    },
    {
      type: 'boolean',
      name: 'notSpam',
    },
    {
      type: 'string',
      name: 'oldJid',
      length: 128,
    },
    {
      type: 'string',
      name: 'pHash',
      length: 128,
    },
    {
      type: 'string',
      name: 'parentGroupId',
      length: 128,
    },
    {
      type: 'json',
      name: 'participant',
    },
    {
      type: 'bigInt',
      name: 'pinned',
    },
    {
      type: 'string',
      name: 'pnJid',
      length: 128,
    },
    {
      type: 'boolean',
      name: 'pnhDuplicateLidThread',
    },
    {
      type: 'boolean',
      name: 'readOnly',
    },
    {
      type: 'boolean',
      name: 'shareOwnPn',
    },
    {
      type: 'boolean',
      name: 'support',
    },
    {
      type: 'boolean',
      name: 'suspended',
    },
    {
      type: 'json',
      name: 'tcToken',
    },
    {
      type: 'bigInt',
      name: 'tcTokenSenderTimestamp',
    },
    {
      type: 'bigInt',
      name: 'tcTokenTimestamp',
    },
    {
      type: 'boolean',
      name: 'terminated',
    },
    {
      type: 'integer',
      name: 'unreadCount',
    },
    {
      type: 'integer',
      name: 'unreadMentionCount',
    },
    {
      type: 'json',
      name: 'wallpaper',
    },
    {
      type: 'integer',
      name: 'lastMessageRecvTimestamp',
    },
    {
      type: 'integer',
      name: 'commentsCount',
    },
    {
      type: 'hasMany',
      name: 'messages',
      target: 'messages',
      foreignKey: 'remoteJid',
      sourceKey: 'id',
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
      fields: ['sessionId', 'id'],
    },
    {
      fields: ['sessionId'],
    },
  ],
});
