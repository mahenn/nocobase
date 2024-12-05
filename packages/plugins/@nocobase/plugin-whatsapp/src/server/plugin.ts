/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/server';
import path from 'path';
import WhatsAppService  from './services/whatsapp';


export class PluginWhatsappServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });

    // this.app.registerService('session', SessionService);
    // this.app.registerService('whatsapp', WhatsAppService);


    this.db.on('sessions.afterCreate', async (session, options) => {
      const sessionId = session.id;
      //console.log(sessionId);
      await WhatsAppService.createSession(sessionId); // Start Baileys session
    });


    // Register actions for sessions resource
    this.app.resourcer.define({
      name: 'sessions',
      // actions: {
      //   // list: sessionActions.list,
      //   // create: sessionActions.create,
      //   // destroy: sessionActions.destroy,
      //   // status: sessionActions.status,
      // },
    });

   // Register WhatsApp service
   // this.app.service('whatsapp', new WhatsAppService(this.app));


    // Set up permissions
    this.app.acl.allow('chats', '*');
    this.app.acl.allow('contacts', '*');
    this.app.acl.allow('messages', '*');
    this.app.acl.allow('groupMetadata', '*');
    this.app.acl.allow('sessions', '*');
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginWhatsappServer;
