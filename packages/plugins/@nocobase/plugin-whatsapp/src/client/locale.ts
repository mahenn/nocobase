// src/client/locale.ts
import { useApp } from '@nocobase/client';
//import pkg from '../../package.json';

const PACKAGE_NAME = '@nocobase/plugin-whatsapp';

export function useT() {
  const app = useApp();
  return (str: string) => app.i18n.t(str, { ns: [PACKAGE_NAME, 'client'] });
}

export function tStr(key: string) {
  return `{{t(${JSON.stringify(key)}, { ns: ['${PACKAGE_NAME}', 'client'], nsMode: 'fallback' })}}`;
}