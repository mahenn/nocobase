// packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/store.ts

import type { BaileysEventEmitter } from '@whiskeysockets/baileys';
import * as handlers from './handlers';

export class Store {
  private readonly chatHandler;
  private readonly messageHandler;
  private readonly contactHandler;
  private readonly groupMetadataHandler;

  constructor(sessionId: string, event: BaileysEventEmitter, app: any) {
    this.chatHandler = handlers.chatHandler(sessionId, event, app);
    this.messageHandler = handlers.messageHandler(sessionId, event, app);
    this.contactHandler = handlers.contactHandler(sessionId, event, app);
    this.groupMetadataHandler = handlers.groupMetadataHandler(sessionId, event, app);
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