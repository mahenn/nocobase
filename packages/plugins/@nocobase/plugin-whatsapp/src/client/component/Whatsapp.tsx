import React, { FC } from 'react';
import { withDynamicSchemaProps } from '@nocobase/client'

export interface WhatsappProps {
  collectionName: string;
  data?: any[];
  loading?: boolean;
}

export const Whatsapp: FC<WhatsappProps> = withDynamicSchemaProps(({ collectionName, data }) => {
  return <div>
    <div>collection: {collectionName}</div>
    <div>data list: <pre>{JSON.stringify(data, null, 2)}</pre></div>
  </div>
}, { displayName: 'whatsappsettings' })
