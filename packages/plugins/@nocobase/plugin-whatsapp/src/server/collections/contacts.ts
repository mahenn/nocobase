import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'contacts',
  title: '{{t("Contacts")}}',
  createdBy: true,
  updatedBy: true,
  shared: true,
  fields: [
    {
      type: 'bigInt',
      name: 'pkId',
      primaryKey: true,
      autoIncrement: true,
      interface: 'integer',
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      type: 'string',
      name: 'sessionId',
      length: 128,
      index: true,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Session ID")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'id',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Contact ID")}}',
        'x-component': 'Input',
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
      },
    },
    {
      type: 'string',
      name: 'notify',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Notify")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'verifiedName',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Verified Name")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'imgUrl',
      length: 255,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Image URL")}}',
        'x-component': 'Input.URL',
      },
    },
    {
      type: 'string',
      name: 'status',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Status")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'belongsTo',
      name: 'session',
      target: 'sessions',
      foreignKey: 'sessionId',
      targetKey: 'sessionId',
      interface: 'select',
      uiSchema: {
        type: 'string',
        title: '{{t("Session")}}',
        'x-component': 'Select',
      },
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