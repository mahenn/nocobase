/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

// plugins/whatsapp/src/collections/contacts.ts
export default {
  name: 'contacts',
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
      name: 'id',
      length: 128,
    },
    {
      type: 'string',
      name: 'name',
      length: 128,
    },
    {
      type: 'string',
      name: 'notify',
      length: 128,
    },
    {
      type: 'string',
      name: 'verifiedName',
      length: 128,
    },
    {
      type: 'string',
      name: 'imgUrl',
      length: 255,
    },
    {
      type: 'string',
      name: 'status',
      length: 128,
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
};
