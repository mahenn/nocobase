// /packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/handlers/contact.ts

import { BaileysEventEmitter, Contact } from '@whiskeysockets/baileys';
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
    // Bind methods
    this.handleSet = this.handleSet.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpsert = this.handleUpsert.bind(this);
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
      //await this.db.sequelize.transaction(async (transaction) => {
        // Process contacts in batches to avoid memory issues
        const batchSize = 100;
        for (let i = 0; i < contacts.length; i += batchSize) {
          const batch = contacts.slice(i, i + batchSize);
          const processedContacts = batch.map(contact => this.processContact(contact));

          for (const contact of processedContacts) {
            await this.repository.updateOrCreate({
              values: contact,
              filterKeys: ['sessionId', 'id'],
              // filter: {
              //   sessionId_id: { 
              //     sessionId: this.sessionId,
              //     id: contact.id 
              //   }
              // },
              //transaction
            });
          }
        }
      //});

      logger.info(`Synced ${contacts.length} contacts`);
    } catch (error) {
      logger.error('Contact sync error:', error);
    }
  }

  async handleUpsert(contacts: Contact[]) {
    try {
      const processedContacts = contacts.map(contact => this.processContact(contact));

      for (const contact of processedContacts) {
        await this.repository.create({
          values: contact,
          filter: {
            sessionId_id: { 
              sessionId: this.sessionId,
              id: contact.id 
            }
          }
        });
      }
    } catch (error) {
      logger.error('Contact upsert error:', error);
    }
  }

  async handleUpdate(updates: Partial<Contact>[]) {
    try {
      for (const update of updates) {
        if (!update.id) continue;

        await this.repository.update({
          filter: {
            sessionId: this.sessionId,
            id: update.id
          },
          values: update
        });
      }
    } catch (error) {
      logger.error('Contact update error:', error);
    }
  }

  listen() {
    if (this.listening) return;

    this.eventEmitter.on('messaging-history.set', this.handleSet);
    this.eventEmitter.on('contacts.upsert', this.handleUpsert);
    this.eventEmitter.on('contacts.update', this.handleUpdate);

    this.listening = true;
  }

  unlisten() {
    if (!this.listening) return;

    this.eventEmitter.off('messaging-history.set', this.handleSet);
    this.eventEmitter.off('contacts.upsert', this.handleUpsert);
    this.eventEmitter.off('contacts.update', this.handleUpdate);

    this.listening = false;
  }
}