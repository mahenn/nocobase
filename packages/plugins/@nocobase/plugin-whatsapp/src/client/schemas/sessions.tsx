import { ISchema } from '@nocobase/client';


// Define collection schema
export const sessionCollection = {
  name: 'sessions',
  filterTargetKey: 'id',
  fields: [
    {
      type: 'string',
      name: 'sessionId',
      interface: 'input',
      uiSchema: {
        title: 'Session ID',
        //required: true,
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'phoneId',
      interface: 'input',
      uiSchema: {
        title: 'Phone ID',
        //required: true,
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'waState',
      interface: 'select',
      uiSchema: {
        title: 'WhatsApp State',
        'x-component': 'Select',
        enum: [
          { label: 'Connected', value: 'CONNECTED' },
          { label: 'Disconnected', value: 'DISCONNECTED' },
          { label: 'Connecting', value: 'CONNECTING' }
        ]
      },
    },
    {
      type: 'text',
      name: 'qrCode',
      interface: 'input',
      uiSchema: {
        title: 'QR Code',
        'x-component': 'Input.TextArea',
      },
    },
    {
      type: 'string',
      name: 'orgPhone',
      interface: 'input',
      uiSchema: {
        title: 'Organization Phone',
        'x-component': 'Input',
      },
    },
    {
      type: 'string',
      name: 'phoneName',
      interface: 'input',
      uiSchema: {
        title: 'Phone Name',
        'x-component': 'Input',
      },
    },
    {
      type: 'boolean',
      name: 'isBrowserOpen',
      interface: 'checkbox',
      uiSchema: {
        title: 'Browser Status',
        'x-component': 'Checkbox',
      },
    }
  ],
};



// Main schema definition
export const schema: ISchema = {
  type: 'void',
  name: 'sessions',
  'x-component': 'CardItem',
  'x-decorator': 'TableBlockProvider',
  'x-decorator-props': {
    collection: sessionCollection.name,
    action: 'list',
    params: {
      pageSize: 20,
    },
    showIndex: true,
    dragSort: false,
  },
  properties: {
    actions: {
      type: 'void',
      'x-component': 'ActionBar',
      'x-component-props': {
        style: { marginBottom: 16 },
      },
      properties: {
        add: {
          type: 'void',
          title: 'Add Session',
          'x-component': 'Action',
          'x-component-props': {
            type: 'primary',
            icon: 'PlusOutlined',
          },
          properties: {
            drawer: {
              type: 'void',
              'x-component': 'Action.Drawer',
              title: 'Add New Session',
              properties: {
                form: {
                  type: 'void',
                  'x-component': 'FormV2',
                  properties: {
                    sessionId: {
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                    },
                    phoneId: {
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                    },
                    waState: {
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                    },
                    qrCode: {
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                    },
                    orgPhone: {
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                    },
                    phoneName: {
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                    },
                    isBrowserOpen: {
                      'x-decorator': 'FormItem',
                      'x-component': 'CollectionField',
                    },
                    footer: {
                      type: 'void',
                      'x-component': 'Action.Drawer.Footer',
                      'x-use-component-props': 'useSubmitActionProps',
                      properties: {
                        cancel: {
                          title: 'Cancel',
                          'x-component': 'Action',
                          'x-component-props': {
                            useAction: '{{ cm.useCancelAction }}',
                          },
                        },
                        submit: {
                          title: 'Submit',
                          'x-component': 'Action',
                          'x-use-component-props': 'useSubmitActionProps',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    table: {
      type: 'array',
      'x-component': 'TableV2',
      'x-component-props': {
        rowKey: 'pkId',
        useProps: '{{ useTableBlockProps }}',
      },
      properties: {
        sessionId: {
          type: 'void',
          'x-component': 'TableV2.Column',
          title: 'SessionId',
          properties: {
            sessionId: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        phoneId: {
          type: 'void',
          'x-component': 'TableV2.Column',
          title: 'PhoneId',
          properties: {
            phoneId: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        waState: {
          type: 'void',
          'x-component': 'TableV2.Column',
          title: 'WhatsApp State',
          properties: {
            waState: {
              type: 'string',
              'x-component': 'CollectionField',
              'x-read-pretty': true,
            },
          },
        },
        actions: {
          type: 'void',
          title: 'Actions',
          'x-component': 'TableV2.Column',
          properties: {
            actions: {
              type: 'void',
              'x-component': 'Space',
              'x-component-props': {
                split: '|',
              },
              properties: {
                edit: {
                  type: 'void',
                  title: 'Edit',
                  'x-component': 'Action.Link',
                  'x-component-props': {
                    openMode: 'drawer',
                  },
                  properties: {
                    drawer: {
                      type: 'void',
                      'x-component': 'Action.Drawer',
                      title: 'Edit Session',
                      properties: {
                        form: {
                          type: 'void',
                          'x-component': 'FormV2',
                          'x-use-component-props': 'useEditFormProps',
                          properties: {
                            sessionId: {
                              'x-decorator': 'FormItem',
                              'x-component': 'CollectionField',
                            },
                            phoneId: {
                              'x-decorator': 'FormItem',
                              'x-component': 'CollectionField',
                            },
                            waState: {
                              'x-decorator': 'FormItem',
                              'x-component': 'CollectionField',
                            },
                            qrCode: {
                              'x-decorator': 'FormItem',
                              'x-component': 'CollectionField',
                            },
                            orgPhone: {
                              'x-decorator': 'FormItem',
                              'x-component': 'CollectionField',
                            },
                            phoneName: {
                              'x-decorator': 'FormItem',
                              'x-component': 'CollectionField',
                            },
                            isBrowserOpen: {
                              'x-decorator': 'FormItem',
                              'x-component': 'CollectionField',
                            },
                            footer: {
                              type: 'void',
                              'x-component': 'Action.Drawer.Footer',
                              properties: {
                                cancel: {
                                  title: 'Cancel',
                                  'x-component': 'Action',
                                  'x-component-props': {
                                    useAction: '{{ cm.useCancelAction }}',
                                  },
                                },
                                submit: {
                                  title: 'Submit',
                                  'x-component': 'Action',
                                  'x-use-component-props': 'useSubmitActionProps',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                delete: {
                  type: 'void',
                  title: 'Delete',
                  'x-component': 'Action.Link',
                  'x-use-component-props': 'useDeleteActionProps',
                  'x-component-props': {
                    confirm: {
                      title: 'Delete Session',
                      content: 'Are you sure you want to delete this session?',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};