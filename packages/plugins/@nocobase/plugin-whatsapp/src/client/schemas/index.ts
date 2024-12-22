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
          'x-designer': 'TableV2.ActionColumnDesigner',
          'x-initializer': 'table:configureItemActions',
        },  
      } 
    },
    }
  }
}