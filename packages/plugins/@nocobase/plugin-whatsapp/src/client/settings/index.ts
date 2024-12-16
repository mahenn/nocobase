// src/client/settings/index.ts
import { ISchema, useField, useFieldSchema } from '@formily/react';
import {
  FilterBlockType,
  useBlockAssociationContext,
  SchemaSettings,
  SchemaSettingsBlockHeightItem,
  SchemaSettingsBlockTitleItem,
  SchemaSettingsCascaderItem,
  SchemaSettingsDataScope,
  SchemaSettingsSelectItem,
  SchemaSettingsSwitchItem,
  SchemaSettingsTemplate,
  removeNullCondition,
  useBlockTemplateContext,
  useCollection,
  useCollectionManager_deprecated,
  useDesignable,
  useFormBlockContext,
  SchemaSettingsConnectDataBlocks,
  SchemaSettingsDefaultSortingRules

} from '@nocobase/client';


export const whatsappSettings = new SchemaSettings ({
  name: 'whatsappsettings',
  items: [
    {
      name: 'title',
      Component: SchemaSettingsBlockTitleItem,
    },
    {
      name: 'setTheBlockHeight',
      Component: SchemaSettingsBlockHeightItem,
    },
    {
      name: 'dataScope',
      Component: SchemaSettingsDataScope,
      useComponentProps() {
        const { name } = useCollection();
        const fieldSchema = useFieldSchema();
        const { form } = useFormBlockContext();
        const field = useField();
        const { dn } = useDesignable();
        return {
          collectionName: name,
          defaultFilter: fieldSchema?.['x-decorator-props']?.params?.filter || {},
          form: form,
          onSubmit: ({ filter }) => {
            filter = removeNullCondition(filter);
            const params = field.decoratorProps.params || {};
            params.filter = filter;
            field.decoratorProps.params = params;
            fieldSchema['x-decorator-props']['params'] = params;
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-decorator-props': field.decoratorProps,
              },
            });
          },
        };
      },
    },
    {
      name: 'ConnectDataBlocks',
      Component: SchemaSettingsConnectDataBlocks,
      useComponentProps() {
        return {
          type: FilterBlockType.TABLE,
          //emptyDescription: t('No blocks to connect'),
        };
      },
    },
    {
      name: 'setDefaultSortingRules',
      Component: SchemaSettingsDefaultSortingRules,
      useComponentProps() {
        return {
          path: 'x-component-props.lineSort',
          title: 'Default Data Sorting Rule',
        };
      },
    },
    {
      name: 'template',
      Component: SchemaSettingsTemplate,
      useComponentProps() {
        const { name } = useCollection();
        const fieldSchema = useFieldSchema();
        const { componentNamePrefix } = useBlockTemplateContext();
        const defaultResource =
          fieldSchema?.['x-decorator-props']?.resource || fieldSchema?.['x-decorator-props']?.association;
        return {
          componentName: `${componentNamePrefix}Calendar`,
          collectionName: name,
          resourceName: defaultResource,
        };
      },
    },
    {
      name: 'remove',
      type: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
        breakRemoveOn: {
          'x-component': 'Grid',
        },
      },
    },
  ],
});