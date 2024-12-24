//src/client/initializer/index.tsx
import React from 'react';
import { SchemaInitializerItemType, useSchemaInitializer } from '@nocobase/client';
import { MessageOutlined } from '@ant-design/icons';
import { getWhatsAppSchema } from '../schemas';
import { useT } from '../locale';

const ALLOWED_COLLECTIONS = ['chats', 'contacts', 'messages'];


export const whatsappInitializerItem: SchemaInitializerItemType = {


         
  name: 'whatsapp',
  Component: 'DataBlockInitializer',
  useComponentProps() {

    const { insert } = useSchemaInitializer();
    const t = useT();

    return {
      title: t('Whatsapp'),
      icon: <MessageOutlined />,
      componentType: 'Whatsapp',
      useTranslationHooks: useT,
      // Add items property to specify which collections to show
      items: [
        {
          type: 'itemGroup',
          title: t('Whatsapp Collections'),
          children: [
            {
              type: 'item',
              title: t('Chats'),
              name: 'chats',
              collection: 'chats',
              dataSource: 'main',
              onCreateBlockSchema({ item }) {
                return insert(getWhatsAppSchema({
                  collection: item.collection,
                  dataSource: item.dataSource
                }));
              }
            },
            {
              type: 'item',
              title: t('Messages'),
              name: 'messages',
              collection: 'messages',
              dataSource: 'main',
              onCreateBlockSchema({ item }) {
                return insert(getWhatsAppSchema({
                  collection: item.collection,
                  dataSource: item.dataSource
                }));
              }
            },
            {
              type: 'item',
              title: t('Contacts'),
              name: 'contacts',
              collection: 'contacts',
              dataSource: 'main',
              onCreateBlockSchema({ item }) {
                return insert(getWhatsAppSchema({
                  collection: item.collection,
                  dataSource: item.dataSource
                }));
              }
            }
          ]
        }
      ],
      onCreateBlockSchema({ item }) {
        insert(getWhatsAppSchema({ 
          dataSource: item.dataSource, 
          collection: item.name 
        }));
      },
    };
  },
};