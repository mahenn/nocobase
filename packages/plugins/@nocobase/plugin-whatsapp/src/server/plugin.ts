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
import { WhatsAppService } from './services/whatsapp';
import { SessionService } from './services/session';


export class PluginWhatsappServer extends Plugin {

  whatsappService: WhatsAppService;
  sessionService: SessionService;

  async afterAdd() {}

  async beforeLoad() {}

  async load() {
  
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });

  
    // Initialize SessionService first
    this.sessionService = new SessionService(this.app);
    await this.sessionService.initialize();

    this.whatsappService = new WhatsAppService(this.app,this.sessionService);
    await this.whatsappService.initialize();
    
    // Update the event listener to use the instance method
    this.db.on('sessions.afterCreate', async (session, options) => {
      console.log("sessions ",session.id);
      const sessionId = session.id;
      await this.whatsappService.createSession({sessionId}); // Use instance method
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

   // Register services in the plugin manager
    // this.app.pm.add('session', this.sessionService);
    // this.app.pm.add('whatsapp', this.whatsappService);


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
