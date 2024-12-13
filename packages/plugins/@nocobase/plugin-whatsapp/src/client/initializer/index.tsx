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
      componentType: 'whatsapp',
      useTranslationHooks: useT,
      filterCollections: (collections) => {
        return collections.filter(collection => 
          ALLOWED_COLLECTIONS.includes(collection.name)
        );
      },
      onCreateBlockSchema({ item }) {
        insert(getWhatsAppSchema({ 
          dataSource: item.dataSource, 
          collection: item.name 
        }));
      },
    };
  },
};
