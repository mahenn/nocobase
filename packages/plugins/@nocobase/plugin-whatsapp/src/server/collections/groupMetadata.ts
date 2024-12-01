/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

// plugins/whatsapp/src/collections/groupMetadata.ts
export default {
  name: 'groupMetadata',
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
      type: 'string',
      name: 'id',
      length: 128,
    },
    {
      type: 'string',
      name: 'owner',
      length: 128,
    },
    {
      type: 'string',
      name: 'subject',
      length: 128,
    },
    {
      type: 'integer',
      name: 'creation',
    },
    {
      type: 'string',
      name: 'desc',
      length: 500,
    },
    {
      type: 'string',
      name: 'descOwner',
      length: 128,
    },
    {
      type: 'boolean',
      name: 'restrict',
    },
    {
      type: 'boolean',
      name: 'announce',
    },
    {
      type: 'integer',
      name: 'size',
    },
    {
      type: 'json',
      name: 'participants',
    },
    {
      type: 'integer',
      name: 'ephemeralDuration',
    },
    {
      type: 'string',
      name: 'inviteCode',
      length: 255,
    },
    {
      type: 'bigInt',
      name: 'descId',
    },
    {
      type: 'bigInt',
      name: 'descTime',
    },
    {
      type: 'string',
      name: 'groupInviteLink',
      length: 255,
    },
    {
      type: 'boolean',
      name: 'isParentGroup',
    },
    {
      type: 'json',
      name: 'memberAddMode',
    },
    {
      type: 'integer',
      name: 'numSubgroups',
    },
    {
      type: 'string',
      name: 'parentGroupId',
      length: 128,
    },
    {
      type: 'json',
      name: 'support',
    },
    {
      type: 'boolean',
      name: 'suspended',
    },
    {
      type: 'json',
      name: 'terminatedUserJids',
    },
    {
      type: 'hasOne',
      name: 'chat',
      target: 'chats',
      foreignKey: 'id',
      sourceKey: 'id',
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
};
