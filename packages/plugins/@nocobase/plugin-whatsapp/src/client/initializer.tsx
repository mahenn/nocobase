// src/client/initializer.tsx
import { SchemaInitializerItemType } from '@nocobase/client';
import { useSchemaInitializer } from '@nocobase/client';
import { useTranslation } from 'react-i18next';
import { uid } from '@formily/shared';
  
export const useWhatsAppTableColumnInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();

  return {
    type: 'item-group',
    title: t('WhatsApp Collections'),
    children: [
      {
        type: 'item',
        title: t('WhatsApp Sessions'),
        component: 'TableBlockInitializer',
        collection: 'whatsapp.sessions',
        onCreateBlockSchema(options) {
          insert({
            type: 'void',
            'x-component': 'CardItem',
            'x-collection': 'whatsapp.sessions',
            properties: {
              [uid()]: {
                type: 'void',
                'x-component': 'BlockItem',
                'x-component-props': {
                  collection: 'whatsapp.sessions',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'table:configureColumns',
                    properties: {},
                  },
                },
              },
            },
          });
        },
      },
      {
        type: 'item',
        title: t('WhatsApp Chats'),
        component: 'TableBlockInitializer',
        collection: 'whatsapp.chats',
        onCreateBlockSchema(options) {
          insert({
            type: 'void',
            'x-component': 'CardItem',
            'x-collection': 'whatsapp.chats',
            properties: {
              [uid()]: {
                type: 'void',
                'x-component': 'BlockItem',
                'x-component-props': {
                  collection: 'whatsapp.chats',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'table:configureColumns',
                    properties: {},
                  },
                },
              },
            },
          });
        },
      },
      // Similar structure for messages and contacts...
    ],
  };
};

