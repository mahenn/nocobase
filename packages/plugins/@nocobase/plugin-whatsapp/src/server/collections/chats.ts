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
  title: '{{t("Chats")}}',
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
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("sessionId")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'boolean',
      name: 'archived',
      interface: 'checkbox', // Added interface
      uiSchema: {
        type: 'boolean',
        title: '{{t("Archived")}}',
        'x-component': 'Checkbox',
      },
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
      interface: 'textarea', // Added interface
      uiSchema: {
        type: 'string',
        title: '{{t("Description")}}',
        'x-component': 'Input.TextArea',
      },
    },
    {
      type: 'json',
      name: 'disappearingMode',
    },
    {
      type: 'string',
      name: 'displayName',
      length: 128,
      interface: 'input', // Added interface
      uiSchema: {
        type: 'string',
        title: '{{t("Display Name")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'boolean',
      name: 'endOfHistoryTransfer',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
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
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Chat ID")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'boolean',
      name: 'isDefaultSubgroup',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'isParentGroup',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'bigInt',
      name: 'lastMsgTimestamp',
    },
    {
      type: 'string',
      name: 'lidJid',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Chat ID")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'boolean',
      name: 'markedAsUnread',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
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
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Chat ID")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'string',
      name: 'newJid',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Chat ID")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'boolean',
      name: 'notSpam',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'string',
      name: 'oldJid',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Chat ID")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'string',
      name: 'pHash',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Chat ID")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'string',
      name: 'parentGroupId',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Chat ID")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
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
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Chat ID")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'boolean',
      name: 'pnhDuplicateLidThread',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'readOnly',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'shareOwnPn',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'support',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'suspended',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
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
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'integer',
      name: 'unreadCount',
      interface: 'integer', // Added interface
      uiSchema: {
        type: 'number',
        title: '{{t("Unread Count")}}',
        'x-component': 'InputNumber',
      },
    },
    {
      type: 'integer',
      name: 'unreadMentionCount',
      interface: 'integer',
      uiSchema: {
          type: 'number',
          title: '{{t("Unread Count")}}',
          'x-component': 'InputNumber',
      },
    },
    {
      type: 'json',
      name: 'wallpaper',
    },
    {
      type: 'integer',
      name: 'lastMessageRecvTimestamp',
      interface: 'datetime', // Added interface
      uiSchema: {
        type: 'string',
        title: '{{t("Last Message Time")}}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
    },
    {
      type: 'integer',
      name: 'commentsCount',
      interface: 'integer',
      uiSchema: {
          type: 'number',
          title: '{{t("Unread Count")}}',
          'x-component': 'InputNumber',
      },

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
