// src/client/schema/index.ts
import { useCollection, useDataBlockRequest } from "@nocobase/client";
import { whatsappSettings } from "../settings";
import { schema,sessionCollection } from './sessions';

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

  return {
    type: 'void',
    // 'x-decorator': 'DataBlockProvider',
    // 'x-toolbar': 'BlockSchemaToolbar',
    // 'x-decorator-props': {
    //   dataSource,
    //   collection,
    //   action: 'list',
    // },
   // 'x-settings': 'blockSettings:table',
    // 'x-component': 'CardItem',
    //'x-toolbar': 'BlockSchemaToolbar',

    'x-settings': 'blockSettings:table',    
    'x-component': 'CardItem',
    'x-decorator': 'TableBlockProvider',
    'x-use-decorator-props': 'useTableBlockDecoratorProps',
    'x-decorator-props': {
      collection: 'users',
      dataSource: 'main',
      action: 'list',
      params: {
        pageSize: 20,
      },
      rowKey: 'id',
      showIndex: true,
      dragSort: false,
    },




    properties: {
       whatsapp: {
         type: 'void',
         //'x-component': "PluginWhatsappSession",
         'x-component': "TableV2.Column",
         //'x-use-component-props': 'useWhatsAppProps',
         'x-initializer': 'table:configureActions',
       },
      actions: {
                // type: 'void',
                // title: '{{ t("Actions") }}',
                // 'x-action-column': 'actions',
                // 'x-decorator': 'TableV2.Column.ActionBar',
                // 'x-component': 'TableV2.Column',
                // 'x-designer': 'TableV2.ActionColumnDesigner',
                // 'x-initializer': 'table:configureItemActions',
                // 'x-component-props': {
                //   width: 400,
                // },
      },
      table: {
      // type: 'array',
      // 'x-component': 'TableV2',
      // 'x-use-component-props': 'useTableBlockProps',
      // 'x-initializer': 'table:configureActions',
      // 'x-designer': 'TableV2.ActionColumnDesigner',                                                                  
      // 'x-component-props': {
      //   rowKey: 'id',
      //   rowSelection: {
      //     type: 'checkbox',
      //   },
      //   useDataSource: '{{ cm.useDataSourceFromRAC }}'
      // },
    },
    }
  }
}