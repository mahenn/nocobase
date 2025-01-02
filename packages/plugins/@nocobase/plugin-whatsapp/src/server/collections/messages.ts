import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'messages',
  title: '{{t("Messages")}}',
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
      name: 'remoteJid',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Remote JID")}}',
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
        title: '{{t("Message ID")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'json',
      name: 'key',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Key")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'json',
      name: 'message',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Message")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'bigInt',
      name: 'messageTimestamp',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: '{{t("Message Timestamp")}}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
      },
    },
    {
      type: 'string',
      name: 'pushName',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Push Name")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'participant',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Participant")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'integer',
      name: 'status',
      interface: 'select',
      uiSchema: {
        type: 'string',
        title: '{{t("Status")}}',
        'x-component': 'Select',
        enum: [
          { label: 'Pending', value: 0 },
          { label: 'Sent', value: 1 },
          { label: 'Received', value: 2 },
          { label: 'Read', value: 3 },
        ],
      },
    },
    {
      type: 'integer',
      name: 'messageStubType',
      interface: 'integer',
      uiSchema: {
        type: 'number',
        title: '{{t("Message Stub Type")}}',
        'x-component': 'InputNumber',
      },
    },
    {
      type: 'json',
      name: 'reactions',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Reactions")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'json',
      name: 'userReceipt',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("User Receipt")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'json',
      name: 'mediaData',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Media Data")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'boolean',
      name: 'broadcast',
      interface: 'checkbox',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Broadcast")}}',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'boolean',
      name: 'clearMedia',
      interface: 'checkbox',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Clear Media")}}',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'integer',
      name: 'duration',
      interface: 'integer',
      uiSchema: {
        type: 'number',
        title: '{{t("Duration")}}',
        'x-component': 'InputNumber',
      },
    },
    {
      type: 'json',
      name: 'ephemeralOutOfSync',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Ephemeral Out Of Sync")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'string',
      name: 'ephemeralStartTimestamp',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Ephemeral Start Timestamp")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'json',
      name: 'labels',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Labels")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'string',
      name: 'mediaKeyTimestamp',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Media Key Timestamp")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'integer',
      name: 'mediaCiphertextSha256',
      interface: 'integer',
      uiSchema: {
        type: 'number',
        title: '{{t("Media Ciphertext SHA256")}}',
        'x-component': 'InputNumber',
      },
    },
    {
      type: 'string',
      name: 'mediaEncSha256',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Media Enc SHA256")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'messageC2STimestamp',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Message C2S Timestamp")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'boolean',
      name: 'multicast',
      interface: 'checkbox',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Multicast")}}',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'string',
      name: 'originalSelfAuthorUserJid',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Original Self Author User JID")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'json',
      name: 'paymentInfo',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Payment Info")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'boolean',
      name: 'finalLiveLocation',
      interface: 'checkbox',
      uiSchema: {
        type: 'boolean',
        title: '{{t("Final Live Location")}}',
        'x-component': 'Checkbox',
      },
    },
    {
      type: 'json',
      name: 'quotedPaymentInfo',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Quoted Payment Info")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'json',
      name: 'quotedStickerData',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Quoted Sticker Data")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'string',
      name: 'serverToken',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Server Token")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'json',
      name: 'statusAlreadyViewed',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("Status Already Viewed")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'string',
      name: 'messageSecret',
      length: 128,
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Message Secret")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'integer',
      name: 'starred',
      interface: 'integer',
      uiSchema: {
        type: 'number',
        title: '{{t("Starred")}}',
        'x-component': 'InputNumber',
      },
    },
    {
      type: 'json',
      name: 'viewOnceMessage',
      interface: 'json',
      uiSchema: {
        type: 'string',
        title: '{{t("View Once Message")}}',
        'x-component': 'Input.JSON',
      },
    },
    {
      type: 'belongsTo',
      name: 'chat',
      target: 'chats',
      foreignKey: 'remoteJid',
      targetKey: 'id',
      interface: 'select',
      uiSchema: {
        type: 'string',
        title: '{{t("Chat")}}',
        'x-component': 'Select',
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
      fields: ['sessionId', 'remoteJid', 'id'],
    },
    {
      fields: ['sessionId'],
    },
  ],
});