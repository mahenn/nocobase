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
import { whatsappActions } from './actions/session';


export class PluginWhatsappServer extends Plugin {

  whatsappService: WhatsAppService;
  
  async afterAdd() {}

  async beforeLoad() {

    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });

  }

  async load() {
  
    

     this.whatsappService = new WhatsAppService(this.app);
    
    // Register the service for dependency injection
    //this.app.set('whatsapp.service', this.whatsappService);

    //Initialize saved sessions
    await this.whatsappService.initialize();
    
    // Update the event listener to use the instance method
    this.db.on('sessions.afterCreate', async (session, options) => {
      console.log("sessions ",session.sessionId);
      const sessionId = session.sessionId;
      await this.whatsappService.createSession({sessionId}); // Use instance method
    });

    this.app.resource({
      name: 'whatsapp',
      actions: whatsappActions
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

  async remove() {

    if (this.whatsappService) {
      const sessions = this.whatsappService.listSessions();
      await Promise.all(
        sessions.map(session => 
          this.whatsappService.deleteSession(session.sessionId)
        )
      );
    }
  }
}

export default PluginWhatsappServer;
