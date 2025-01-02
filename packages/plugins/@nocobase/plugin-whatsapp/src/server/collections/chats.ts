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
      uiSchema: { 
        type: 'number', 
        title: '{{t("ID")}}', 
        'x-component': 'InputNumber', 
        'x-read-pretty': true 
      },
      interface: 'id',
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
      interface: 'json',  // Add this
      uiSchema: {         // Add this
        type: 'string',
        title: '{{t("Contact Primary Identity Key")}}',
        'x-component': 'Input.JSON',
      }
    },
    {
      type: 'bigInt',
      name: 'conversationTimestamp',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: '{{t("Conversation Timestamp")}}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
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
      interface: 'json',  // Add this
      uiSchema: {         // Add this
        type: 'string',
        title: '{{t("Disappearing Mode")}}',
        'x-component': 'Input.JSON',
      }
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
        title: 'End of History Transfer',
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
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: '{{t("ephemeral Setting Timestamp")}}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
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
        title: 'Is Default Sub Group',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'isParentGroup',
      interface: 'checkbox',
      uiSchema: {
        title: 'Is Parent Group',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'bigInt',
      name: 'lastMsgTimestamp',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: '{{t("Last Message Timestamp")}}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
    },
    {
      type: 'string',
      name: 'lidJid',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Lid Id")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'boolean',
      name: 'markedAsUnread',
      interface: 'checkbox',
      uiSchema: {
        title: 'Marked As Unread',
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
      interface: 'json',  // Add this
      uiSchema: {         // Add this
        type: 'string',
        title: '{{t("Message")}}',
        'x-component': 'Input.JSON',
      }
    },
    {
      type: 'bigInt',
      name: 'muteEndTime',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: '{{t("Mute End Time")}}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
    },
    {
      type: 'string',
      name: 'name',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Name")}}',
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
        title: '{{t("New Jid")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'boolean',
      name: 'notSpam',
      interface: 'checkbox',
      uiSchema: {
        title: 'Not Spam',
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
        title: '{{t("Old Jid")}}',
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
        title: '{{t("PHash")}}',
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
        title: '{{t("Parent Group Id")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'json',
      name: 'participant',
      interface: 'json',  // Add this
      uiSchema: {         // Add this
        type: 'string',
        title: '{{t("participant")}}',
        'x-component': 'Input.JSON',
      }
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
        title: '{{t("PNJid")}}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'boolean',
      name: 'pnhDuplicateLidThread',
      interface: 'checkbox',
      uiSchema: {
        title: 'Duplicate Lead Thread',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'readOnly',
      interface: 'checkbox',
      uiSchema: {
        title: 'Read Only',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'shareOwnPn',
      interface: 'checkbox',
      uiSchema: {
        title: 'Share Own Pn',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'support',
      interface: 'checkbox',
      uiSchema: {
        title: 'Support',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'suspended',
      interface: 'checkbox',
      uiSchema: {
        title: 'Suspended',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'json',
      name: 'tcToken',
      interface: 'json',  // Add this
      uiSchema: {         // Add this
        type: 'string',
        title: '{{t("TC Token")}}',
        'x-component': 'Input.JSON',
      }
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
        title: 'Terminated',
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
          title: '{{t("Unread Mention Count")}}',
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
          title: '{{t("Comments Count")}}',
          'x-component': 'InputNumber',
      },
    },
    {
      type: 'hasMany',
      name: 'messages',
      target: 'messages',
      foreignKey: 'remoteJid',
      sourceKey: 'id',
      interface: 'linkTo',
      uiSchema: {
        type: 'array',
        title: '{{t("Messages")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
        },
      },
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
