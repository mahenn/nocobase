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
import { whatsappActions } from './actions/sessions';
import { 
  sessionActions, 
  messageActions, 
  contactActions,
  miscActions,
  groupActions,
  chatActions 
} from './actions';
import { whatsAppService } from './middlewares/whatsapp';



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

    //, { tag: 'whatsAppService', before: 'acl', after: 'auth' }
    this.app.resourcer.use(whatsAppService);


    Object.entries(chatActions).forEach(([action, handler]) =>
      this.app.resourcer.registerAction(`chats:${action}`, handler),
    );

    Object.entries(groupActions).forEach(([action, handler]) =>
      this.app.resourcer.registerAction(`groups:${action}`, handler),
    );

    Object.entries(sessionActions).forEach(([action, handler]) =>
      this.app.resourcer.registerAction(`sessions:${action}`, handler),
    );

    Object.entries(messageActions).forEach(([action, handler]) =>
      this.app.resourcer.registerAction(`messages:${action}`, handler),
    );

    Object.entries(contactActions).forEach(([action, handler]) =>
      this.app.resourcer.registerAction(`contacts:${action}`, handler),
    );

    Object.entries(miscActions).forEach(([action, handler]) =>
      this.app.resourcer.registerAction(`misc:${action}`, handler),
    );

    // // Register group actions
    // this.app.resource({
    //   name: 'whatsapp.groups',
    //   actions: {
    //     list: groupActions.list,
    //     find: groupActions.find,
    //     create: groupActions.create,
    //     updateParticipants: groupActions.updateParticipants,
    //     updateSubject: groupActions.updateSubject,
    //     updateSetting: groupActions.updateSetting,
    //     leave: groupActions.leave
    //   }
    // });

    // this.app.resource({
    //   name: 'whatsapp.sessions',
    //   actions: {
    //     create: sessionActions.create,
    //     delete: sessionActions.delete,
    //     status: sessionActions.status,
    //     qr: sessionActions.qr,
    //     logout: sessionActions.logout
    //   }
    // });

    // this.app.resource({
    //   name: 'whatsapp.messages',
    //   actions: {
    //     send: messageActions.send,
    //     sendBulk: messageActions.sendBulk,
    //     deleteForMe: messageActions.deleteForMe,
    //     deleteForAll: messageActions.deleteForAll,
    //     download: messageActions.download,
    //     react: messageActions.react
    //   }
    // });

    // this.app.resource({
    //   name: 'contacts',
    //   actions: {
    //     list: contactActions.list,
    //     check: contactActions.check,
    //     block: contactActions.block,
    //     unblock: contactActions.unblock
    //   }
    // });

    // this.app.resource({
    //   name: 'whatsapp.misc',
    //   actions: {
    //     getPhotoURL: miscActions.getPhotoURL,
    //     updatePresence: miscActions.updatePresence
    //   }
    // });

    // Set up permissions
    this.app.acl.allow('chats', '*');
    this.app.acl.allow('contacts', '*');
    this.app.acl.allow('messages', '*');
    this.app.acl.allow('groups', '*');
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
