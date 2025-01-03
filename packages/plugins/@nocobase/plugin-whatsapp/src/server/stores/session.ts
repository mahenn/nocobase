// /packages/plugins/@nocobase/plugin-whatsapp/src/server/stores/session.ts

import { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from '@whiskeysockets/baileys';
import { proto } from '@whiskeysockets/baileys';
import { BufferJSON, initAuthCreds } from '@whiskeysockets/baileys';
import { logger } from '../utils/logger';

const fixId = (id: string) => id.replace(/\//g, "__").replace(/:/g, "-");

export async function useSession(sessionId: string, app: any): Promise<{
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
}> {
  const repository = app.db.getRepository('sessions');

  const write = async (data: any, id: string) => {
    try {
      data = JSON.stringify(data, BufferJSON.replacer);
      id = fixId(id);
      
      await repository.updateOrCreate({
        values: {
          sessionId,
          id,
          data,
        },
        filterKeys: ['sessionId'],
      });
    } catch (error) {
      logger.error('Session write error:', error);
    }
  };

  const read = async (id: string) => {
    try {
      const result = await repository.findOne({
        filter: {
          sessionId,
          id: fixId(id),
        },
      });

      if (!result) {
        logger.info(`No session data found for id: ${id}`);
        return null;
      }

      return JSON.parse(result.data, BufferJSON.reviver);
    } catch (error) {
      logger.error('Session read error:', error);
      return null;
    }
  };

  const del = async (id: string) => {
    try {
      await repository.destroy({
        filter: {
          sessionId,
          id: fixId(id),
        },
      });
    } catch (error) {
      logger.error('Session delete error:', error);
    }
  };

  const creds: AuthenticationCreds = (await read('creds')) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async <T extends keyof SignalDataTypeMap>(
          type: T,
          ids: string[]
        ): Promise<{ [id: string]: SignalDataTypeMap[T] }> => {
          const data: { [key: string]: SignalDataTypeMap[typeof type] } = {};
          
          await Promise.all(
            ids.map(async (id) => {
              let value = await read(`${type}-${id}`);
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            })
          );
          
          return data;
        },
        
        set: async (data: any): Promise<void> => {
          const tasks: Promise<void>[] = [];
          
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const sId = `${category}-${id}`;
              tasks.push(value ? write(value, sId) : del(sId));
            }
          }
          
          await Promise.all(tasks);
        }
      }
    },
    saveCreds: () => write(creds, 'creds')
  };
}