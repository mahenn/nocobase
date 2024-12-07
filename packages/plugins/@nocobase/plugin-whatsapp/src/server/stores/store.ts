// /packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/store.ts

import { BaileysEventEmitter } from '@whiskeysockets/baileys';
import { ChatHandler } from './handlers/chat';
import { MessageHandler } from './handlers/message';
import { ContactHandler } from './handlers/contact';
import { GroupMetadataHandler } from './handlers/group-meta';

export class Store {
  private readonly chatHandler: ChatHandler;
  private readonly messageHandler: MessageHandler;
  private readonly contactHandler: ContactHandler;
  private readonly groupMetadataHandler: GroupMetadataHandler;

  constructor(
    private readonly sessionId: string,
    private readonly eventEmitter: BaileysEventEmitter,
    private readonly db: any
  ) {
    this.chatHandler = new ChatHandler(sessionId, eventEmitter, db);
    this.messageHandler = new MessageHandler(sessionId, eventEmitter, db);
    this.contactHandler = new ContactHandler(sessionId, eventEmitter, db);
    this.groupMetadataHandler = new GroupMetadataHandler(sessionId, eventEmitter, db);
    this.listen();
  }

  public listen() {
    this.chatHandler.listen();
    this.messageHandler.listen();
    this.contactHandler.listen();
    this.groupMetadataHandler.listen();
  }

  public unlisten() {
    this.chatHandler.unlisten();
    this.messageHandler.unlisten();
    this.contactHandler.unlisten();
    this.groupMetadataHandler.unlisten();
  }
}