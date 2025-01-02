import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'sessions',
  title: '{{t("Sessions")}}',
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
      unique: true,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Session ID")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'status',
      interface: 'select',
      uiSchema: {
        type: 'string',
        title: '{{t("Status")}}',
        'x-component': 'Select',
        enum: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Error', value: 'error' }
        ],
      },
    },
    {
      type: 'string',
      name: 'id',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("ID")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'text',
      name: 'data',
      interface: 'textarea',
      uiSchema: {
        type: 'string',
        title: '{{t("Data")}}',
        'x-component': 'Input.TextArea',
      },
    },
    {
      name: 'qrCode',
      type: 'text',
      interface: 'textarea',
      uiSchema: {
        type: 'string',
        title: '{{t("QR Code")}}',
        'x-component': 'Input.TextArea',
      },
    },
    {
      name: 'orgPhone',
      type: 'string',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Organization Phone")}}',
        'x-component': 'Input',
      },
    },
    {
      name: 'waState',
      type: 'string',
      interface: 'select',
      uiSchema: {
        type: 'string',
        title: '{{t("WhatsApp State")}}',
        'x-component': 'Select',
        enum: [
          { label: 'Connected', value: 'CONNECTED' },
          { label: 'Disconnected', value: 'DISCONNECTED' },
          { label: 'Connecting', value: 'CONNECTING' }
        ],
      },
    },
    {
      name: 'phoneState',
      type: 'bigInt',
      allowNull: true,
      interface: 'integer',
      uiSchema: {
        type: 'number',
        title: '{{t("Phone State")}}',
        'x-component': 'InputNumber',
      },
    },
    {
      name: 'isBrowserOpen',
      type: 'boolean',
      interface: 'checkbox',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Browser Status")}}',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'json',
      name: 'error',
      description: 'Stores error information',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Error")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'json',
      name: 'connectionState',
      description: 'Current connection state',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Connection State")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'integer',
      name: 'retryCount',
      defaultValue: 0,
      interface: 'integer',
      uiSchema: {
        type: 'number',
        title: '{{t("Retry Count")}}',
        'x-component': 'InputNumber',
      },
    },
    {
      type: 'date',
      name: 'lastConnected',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: '{{t("Last Connected")}}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
    },
    {
      type: 'hasMany',
      name: 'chats',
      target: 'chats',
      foreignKey: 'sessionId',
      sourceKey: 'sessionId',
      interface: 'linkTo',
      uiSchema: {
        type: 'array',
        title: '{{t("Chats")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
        },
      },
    },
    {
      type: 'hasMany',
      name: 'contacts',
      target: 'contacts',
      foreignKey: 'sessionId',
      sourceKey: 'sessionId',
      interface: 'linkTo',
      uiSchema: {
        type: 'array',
        title: '{{t("Contacts")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
        },
      },
    },
    {
      type: 'hasMany',
      name: 'messages',
      target: 'messages',
      foreignKey: 'sessionId',
      sourceKey: 'sessionId',
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
  ],
  indexes: [
    {
      unique: true,
      fields: ['sessionId'],
    },
  ],
});