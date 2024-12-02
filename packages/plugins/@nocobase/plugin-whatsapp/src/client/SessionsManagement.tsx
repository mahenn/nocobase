// src/client/PluginWhatsappSession.tsx
import React from 'react';
import {  ExtendCollectionsProvider, SchemaComponent } from '@nocobase/client';
import { schema,sessionCollection } from './schemas/sessions';
import { useSubmitActionProps,useEditFormProps,useDeleteActionProps } from './hooks';

// Main component
export const PluginWhatsappSession = () => {
  return (
    <ExtendCollectionsProvider collections={[sessionCollection]}>
      <SchemaComponent 
        schema={schema} 
        scope={{ useSubmitActionProps, useEditFormProps, useDeleteActionProps }} 
      />
    </ExtendCollectionsProvider>
  );
};