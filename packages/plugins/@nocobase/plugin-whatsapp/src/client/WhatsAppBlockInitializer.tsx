// src/client/WhatsAppBlockInitializer.tsx
import React from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { SchemaInitializer } from '@nocobase/client';

export const WhatsAppBlockInitializer: React.FC<any> = (props) => {
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<MessageOutlined />}
      title={'WhatsApp'}
      onClick={() => {
        props.insert({
          type: 'void',
          'x-component': 'WhatsApp',
          'x-decorator': 'BlockItem',
          'x-component-props': {
            // your props here
          }
        });
      }}
    />
  );
};