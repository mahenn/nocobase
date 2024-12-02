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
import * as sessionActions from './actions/session';

export class PluginWhatsappServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });

    // this.app.registerService('session', SessionService);
    // this.app.registerService('whatsapp', WhatsAppService);

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
