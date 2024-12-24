// src/client/schema/index.ts
import { useCollection, useDataBlockRequest } from "@nocobase/client";
import { whatsappSettings } from "../settings";
import { schema,sessionCollection } from './sessions';
import { uid } from '@formily/shared';

export interface WhatsAppProps {
  collectionName: string;
  data: any[];
  loading: boolean;
}

export function useWhatsAppProps(): WhatsAppProps {
  const collection = useCollection();
  const { data, loading } = useDataBlockRequest<any[]>();

  return {
    collectionName: collection.name,
    data: data?.data,
    loading: loading
  }
} 

export function getWhatsAppSchema({ dataSource = 'main', collection }) {


  if (collection === 'messages') {
    return {
      type: 'void',
      'x-settings': 'blockSettings:table',
      'x-toolbar': 'BlockSchemaToolbar',
      'x-component': 'CardItem',
      'x-decorator': 'TableBlockProvider',
      'x-decorator-props': {
        collection,
        action: 'list',
        params: {
          pageSize: 20,
        }
      },
      properties: {
        actions: {
          type: 'void',
          version: '2.0',
          'x-component': 'ActionBar',
          'x-initializer': 'table:configureActions',
          'x-component-props': {
            style: {
              marginBottom: 'var(--nb-spacing)',
            },
          },
        },
        chat: {
          type: 'void',
          'x-component': 'WhatsAppChat',
          'x-use-component-props': 'useWhatsAppProps',
          'x-component-props': {
            style: {
              height: 'calc(100vh - 200px)',
              margin: '-24px',
            }
          },
        }
      }
    };
  }


  return {
    type: 'void',
    'x-settings': 'blockSettings:table',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:table',    
    'x-component': 'CardItem',
    'x-decorator': 'TableBlockProvider',
    'x-decorator-props': {
      collection,
      action: 'list',
      showIndex: true,
      dragSort: false,
    },

    properties: {

      actions: 
      {
        type: 'void',
        version: '2.0',
        'x-component': 'ActionBar',
        'x-initializer': 'table:configureActions',
        'x-component-props': {
          style: {
            marginBottom: 'var(--nb-spacing)',
          },
        },
      },
      table: 
      {
        type: 'array',
        'x-component': 'TableV2',
        'x-use-component-props': 'useTableBlockProps',
        'x-initializer': 'table:configureColumns',
        'x-designer': 'TableV2.ActionColumnDesigner',                                                                  
        'x-component-props': {
          rowKey: 'id',
          rowSelection: {
            type: 'checkbox',
          },
        },
        properties: {
        actions: 
        {
          type: 'void',
          title: '{{ t("Actions") }}',
          'x-action-column': 'actions',
          'x-decorator': 'TableV2.Column.ActionBar',
          'x-component': 'TableV2.Column',
          'x-toolbar': 'TableColumnSchemaToolbar',
          'x-designer': 'TableV2.ActionColumnDesigner',
          'x-initializer': 'table:configureItemActions',
          'x-action-column': 'actions',
          properties: {
            actions: {
              type: 'void',
              'x-decorator': 'DndContext',
              'x-component': 'Space',
              'x-component-props': {
                split: '|',
              },
              properties: {},
            },
          },
        },  
      } 
    },
    }
  }
}


// detail view logic in case require
// if (collection === 'messages') {
//       return {
//       type: 'void',
//       'x-acl-action': `${collection}:view`,
//       'x-decorator': 'DetailsBlockProvider',
//       'x-use-decorator-props': 'useDetailsWithPaginationDecoratorProps',
//       'x-decorator-props': {
//         dataSource,
//         collection: collection,
//         readPretty: true,
//         action: 'list',
//         params: {
//           pageSize: 1,
//         },
//       },
//       'x-toolbar': 'BlockSchemaToolbar',
//       'x-settings': 'blockSettings:detailsWithPagination',
//       'x-component': 'CardItem',

//       properties: {
//         [uid()]: {
//           type: 'void',
//           'x-component': 'Details',
//           'x-read-pretty': true,
//           'x-use-component-props': 'useDetailsWithPaginationProps',
//           properties: {
//             [uid()]: {
//               type: 'void',
//               'x-initializer': 'details:configureActions',
//               'x-component': 'ActionBar',
//               'x-component-props': {
//                 style: {
//                   marginBottom: 24,
//                 },
//               },
//               properties: {},
//             },
            
//             grid:   {
//               type: 'void',
//               'x-component': 'Grid',
//               'x-initializer': 'details:configureFields',
//               properties: {},
//             },
//             pagination: {
//               type: 'void',
//               'x-component': 'Pagination',
//               'x-use-component-props': 'useDetailsPaginationProps',
//             },
//           },
//         },
//       },
//     };
//   }