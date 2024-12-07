/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

// src/server/collections/sessions.ts
export default {
  name: 'sessions',
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
      name: 'status',
    },
    {
      type: 'string',
      name: 'id',
    },
    {
      type: 'text',
      name: 'data',
    },
    { 
      name: 'qrCode', 
      type: 'text',  
    },
    { 
      name: 'orgPhone', 
      type: 'string', 
    },
    { 
      name: 'waState', 
      type: 'string',  
    },
    { 
      name: 'phoneState', 
      type: 'bigInt', allowNull: true,
    },
    { 
      name: 'isBrowserOpen', 
      type: 'boolean', 
    },
    {
      type: 'json',
      name: 'error',
      description: 'Stores error information'
    },
    {
      type: 'json',
      name: 'connectionState',
      description: 'Current connection state'
    },
    {
      type: 'integer',
      name: 'retryCount',
      defaultValue: 0
    },
    {
      type: 'date',
      name: 'lastConnected'
    },
    {
      type: 'hasMany',
      name: 'chats',
      target: 'chats',
      foreignKey: 'sessionId',
      sourceKey: 'sessionId',
    },
    {
      type: 'hasMany',
      name: 'contacts',
      target: 'contacts',
      foreignKey: 'sessionId',
      sourceKey: 'sessionId',
    },
    {
      type: 'hasMany',
      name: 'messages',
      target: 'messages',
      foreignKey: 'sessionId',
      sourceKey: 'sessionId',
    },
  ],
  indexes: [
    {
      unique: true,
      fields: ['sessionId'],
    },
  ],
};
