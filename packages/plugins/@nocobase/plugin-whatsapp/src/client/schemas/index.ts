// src/client/schema/index.ts
import { useCollection, useDataBlockRequest } from "@nocobase/client";
import { whatsappSettings } from "../settings";

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
    'x-decorator': 'DataBlockProvider',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-decorator-props': {
      dataSource,
      collection,
      action: 'list',
    },
    'x-settings': 'WhatsappSettings',
    'x-component': 'CardItem',
    properties: {
      whatsapp: {
        type: 'void',
        'x-component': "WhatsappSettings",
        'x-use-component-props': 'useWhatsAppProps',
      }
    }
  }
}