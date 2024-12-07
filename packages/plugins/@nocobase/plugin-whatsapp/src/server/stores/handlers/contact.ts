// /packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/contact.ts

import type { BaileysEventEmitter, Contact } from '@whiskeysockets/baileys';
import { logger } from '../../utils/logger';

export class ContactHandler {
  private listening = false;
  private repository: any;

  constructor(
    private readonly sessionId: string,
    private readonly eventEmitter: BaileysEventEmitter,
    private readonly db: any
  ) {
    this.repository = db.getRepository('contacts');
  }

  private processContact(contact: Contact) {
    return {
      sessionId: this.sessionId,
      id: contact.id,
      name: contact.name,
      notify: contact.notify,
      verifiedName: contact.verifiedName,
      imgUrl: contact.imgUrl,
      status: contact.status
    };
  }

  async handleSet({ contacts }: { contacts: Contact[] }) {
    try {
      const processedContacts = contacts.map(this.processContact.bind(this));

      for (const contact of processedContacts) {
        await this.repository.create({
          values: contact,
          filter: {
            id: contact.id,
            sessionId: this.sessionId
          }
        });
      }

      logger.info(`Synced ${contacts.length} contacts`);
    } catch (error) {
      logger.error('Error in handleSet:', error);
    }
  }

  async handleUpsert(contacts: Contact[]) {
    try {
      const processedContacts = contacts.map(this.processContact.bind(this));

      for (const contact of processedContacts) {
        await this.repository.create({
          values: contact,
          filter: {
            id: contact.id,
            sessionId: this.sessionId
          }
        });
      }
    } catch (error) {
      logger.error('Error in handleUpsert:', error);
    }
  }

  async handleUpdate(updates: Partial<Contact>[]) {
    for (const update of updates) {
      try {
        if (!update.id) continue;

        await this.repository.update({
          filter: {
            id: update.id,
            sessionId: this.sessionId
          },
          values: update
        });
      } catch (error) {
        logger.error('Error in handleUpdate:', error);
      }
    }
  }

  listen() {
    if (this.listening) return;

    this.eventEmitter.on('messaging-history.set', this.handleSet.bind(this));
    this.eventEmitter.on('contacts.upsert', this.handleUpsert.bind(this));
    this.eventEmitter.on('contacts.update', this.handleUpdate.bind(this));

    this.listening = true;
  }

  unlisten() {
    if (!this.listening) return;

    this.eventEmitter.off('messaging-history.set', this.handleSet.bind(this));
    this.eventEmitter.off('contacts.upsert', this.handleUpsert.bind(this));
    this.eventEmitter.off('contacts.update', this.handleUpdate.bind(this));

    this.listening = false;
  }
}