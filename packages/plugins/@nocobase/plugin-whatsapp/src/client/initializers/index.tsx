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
      filterCollections: (collections) => {
        console.log(collections);
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





// import { TableOutlined } from '@ant-design/icons';
// import React, { FC } from 'react';

// import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';

// export const whatsappInitializerItem: FC<any> = () => {
//   const itemConfig = useSchemaInitializerItem();
//   const { insert } = useSchemaInitializer();
//   return (
//     <SchemaInitializerItem
//       icon={<TableOutlined />}
//       {...itemConfig}
//       onClick={() => {
//         insert({
//           type: 'void',
//           //'x-decorator': 'WorkflowTodo.Decorator',
//           'x-decorator-props': {},
//           'x-component': 'CardItem',
//           'x-toolbar': 'BlockSchemaToolbar',
//           'x-settings': 'blockSettings:table',
//           properties: {
//             todos: {
//               type: 'void',
//               'x-component': 'PluginWhatsappSession',
//             },
//           },
//         });
//       }}
//     />
//   );
// };
