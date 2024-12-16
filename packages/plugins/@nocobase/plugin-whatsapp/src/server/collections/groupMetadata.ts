import { defineCollection } from '@nocobase/database';

// Collection schema for group metadata
export default defineCollection({
  name: 'groupMetadata',
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
      index: true,
    },
    {
      type: 'string',
      name: 'id',
      index: true,
    },
    {
      type: 'string',
      name: 'owner',
    },
    {
      type: 'string',
      name: 'subject',
    },
    {
      type: 'integer',
      name: 'subjectTime',
    },
    {
      type: 'string',
      name: 'subjectOwner',
    },
    {
      type: 'text',
      name: 'desc',
    },
    {
      type: 'string',
      name: 'descId',
    },
    {
      type: 'string',
      name: 'descOwner',
    },
    {
      type: 'integer',
      name: 'descTime',
    },
    {
      type: 'integer',
      name: 'creation',
    },
    {
      type: 'json',
      name: 'participants',
    },
    {
      type: 'string',
      name: 'announceVersionId',
    },
    {
      type: 'boolean',
      name: 'announce',
    },
    {
      type: 'boolean',
      name: 'noFrequentlyForwarded',
    },
    {
      type: 'integer',
      name: 'ephemeralDuration',
    },
    {
      type: 'string',
      name: 'memberAddMode',
    },
    {
      type: 'integer',
      name: 'size',
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
      type: 'boolean',
      name: 'terminated',
    },
    {
      type: 'boolean',
      name: 'restrict',
    },
    {
      type: 'string',
      name: 'defaultSubgroup',
    },
    {
      type: 'string',
      name: 'parentGroup',
    },
    {
      type: 'boolean',
      name: 'isParentGroup',
    },
    {
      type: 'boolean',
      name: 'isDefaultSubgroup',
    },
    {
      type: 'boolean',
      name: 'notificationsEnabled',
    },
    {
      type: 'integer',
      name: 'lastActivityTimestamp',
    },
    {
      type: 'integer',
      name: 'lastSeenActivityTimestamp',
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
} );