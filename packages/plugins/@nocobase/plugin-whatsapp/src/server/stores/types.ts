// packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/types.ts

import type { BaileysEventMap } from '@whiskeysockets/baileys';

export type BaileysEventHandler<T extends keyof BaileysEventMap> = (
  args: BaileysEventMap[T]
) => void | Promise<void>;