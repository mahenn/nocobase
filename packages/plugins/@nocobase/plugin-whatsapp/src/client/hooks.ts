/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React,{useMemo} from 'react';
import {  ExtendCollectionsProvider, SchemaComponent, useActionContext, 
         useDataBlockRequest, useDataBlockResource, useCollection, useCollectionRecordData } from '@nocobase/client';
import { App as AntdApp } from 'antd';
import { createForm } from '@formily/core';
import { useForm } from '@formily/react';
import { ActionProps } from '@nocobase/client';

export const useSubmitActionProps = (): ActionProps => {

  const form = useForm();
  const { message } = AntdApp.useApp();
  const collection = useCollection();
  const resource = useDataBlockResource();
  const { runAsync } = useDataBlockRequest();
  const { setVisible } = useActionContext();

  return {
    type: 'primary',
    htmlType: 'submit',
    async onClick() {
      console.log(form.values);
      await form.submit();
      const values = form.values;
      await resource.updateOrCreate({
        values,
        filterKeys: [collection.filterTargetKey],
      });
      await runAsync();
      message.success('Saved successfully!');
      setVisible(false);
    },
  };
};


// Edit form hook
export const useEditFormProps = () => {
  const recordData = useCollectionRecordData();
  const form = useMemo(
    () => createForm({
      initialValues: recordData,
    }),
    [recordData],
  );
  return {
    form,
  };
};

// Delete action hook
export const useDeleteActionProps = () => {
  const { message } = AntdApp.useApp();
  const record = useCollectionRecordData();
  const resource = useDataBlockResource();
  const collection = useCollection();
  const { runAsync } = useDataBlockRequest();


  return {
    confirm: {
      title: 'Delete Session',
      content: 'Are you sure you want to delete this WhatsApp session?',
    },
    async onClick() {
      await resource.destroy({
        filterByTk: record[collection.filterTargetKey],
      });
      await runAsync();
      message.success('Session deleted successfully');
    },
  };
};