/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/client';
import { tval } from '@nocobase/utils/client';
import  {PluginWhatsappSession}  from './SessionsManagement';

//import { WhatsApp } from './component';
import { whatsappInitializerItem   } from './initializer';
//import { useWhatsAppProps } from './schemas';
import { whatsappSettings } from './settings';

export class PluginWhatsappClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  async load() {

    this.app.schemaInitializerManager.addItem('page:addBlock', 'otherBlocks.whatsapp', whatsappInitializerItem);
    this.app.schemaInitializerManager.addItem('popup:addNew:addBlock', `otherBlocks.${whatsappInitializerItem.name}`, whatsappInitializerItem);
    //this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `otherBlocks.${whatsappInitializerItem.name}`, whatsappInitializerItem);
    
    this.app.schemaSettingsManager.add(whatsappSettings);

    this.app.pluginSettingsManager.add('whatsapp-session', {
      title: tval('Whatsapp', { ns: 'Whatsapp Sessions' }),
      icon: 'ClusterOutlined',
      Component: PluginWhatsappSession,
    })
    

  }
}

export default PluginWhatsappClient;
