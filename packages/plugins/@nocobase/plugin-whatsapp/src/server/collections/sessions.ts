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
      name: 'id',
      length: 255,
    },
    {
      type: 'text',
      name: 'data',
    },
  ],
  indexes: [
    {
      unique: true,
      fields: ['sessionId'],
    },
  ],
};
