import { Client, LocalAuth } from 'whatsapp-web.js';
import fs from 'fs';
import path from 'path';
import { tiggerWS, waitForNestedObject, checkIfEventisEnabled } from './utils';
import {
  sessionFolderPath,
  maxAttachmentSize,
  setMessagesAsSeen,
  webVersion,
  webVersionCacheType,
  recoverSessions
} from './config';

// Define a map to hold sessions
const sessions = new Map<string, Client>();

// Type for session validation response
interface SessionValidationResponse {
  success: boolean;
  state: string | null;
  message: string;
}

// Function to validate if the session is ready
const validateSession = async (sessionId: string): Promise<SessionValidationResponse> => {
  try {
    const returnData: SessionValidationResponse = { success: false, state: null, message: '' };

    if (!sessions.has(sessionId) || !sessions.get(sessionId)) {
      returnData.message = 'session_not_found';
      return returnData;
    }

    const client = sessions.get(sessionId)!;
    await waitForNestedObject(client, 'pupPage')
      .catch((err: Error) => ({ success: false, state: null, message: err.message }));

    let maxRetry = 0;
    while (true) {
      try {
        if (client.pupPage.isClosed()) {
          return { success: false, state: null, message: 'browser tab closed' };
        }
        await Promise.race([
          client.pupPage.evaluate('1'),
          new Promise(resolve => setTimeout(resolve, 1000)),
        ]);
        break;
      } catch (error) {
        if (maxRetry === 2) {
          return { success: false, state: null, message: 'session closed' };
        }
        maxRetry++;
      }
    }

    const state = await client.getState();
    returnData.state = state;
    if (state !== 'CONNECTED') {
      returnData.message = 'session_not_connected';
      return returnData;
    }

    returnData.success = true;
    returnData.message = 'session_connected';
    return returnData;
  } catch (error) {
    return { success: false, state: null, message: (error as Error).message };
  }
};

// Function to handle client session restoration
const restoreSessions = (): void => {
  try {
    if (!fs.existsSync(sessionFolderPath)) {
      fs.mkdirSync(sessionFolderPath); // Create the session directory if it doesn't exist
    }
    fs.readdir(sessionFolderPath, (_, files) => {
      for (const file of files) {
        const match = file.match(/^session-(.+)$/);
        if (match) {
          const sessionId = match[1];
          console.log('existing session detected', sessionId);
          setupSession(sessionId);
        }
      }
    });
  } catch (error) {
    console.error('Failed to restore sessions:', error);
  }
};

// Setup session
const setupSession = (socket,sessionId: string) => {
  try {
    if (sessions.has(sessionId)) {
      console.log("Session already exist",sessionId);
      return { success: false, message: `Session already exists for: ${sessionId}`, client: sessions.get(sessionId) };
    }

    console.log("new Session starting",sessionId);

    const localAuth = new LocalAuth({ clientId: sessionId, dataPath: sessionFolderPath });
    localAuth.logout = () => {};

    const clientOptions: any = {
      puppeteer: {
        executablePath: process.env.CHROME_BIN || null,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
      authStrategy: localAuth,
    };

    if (webVersion) {
      clientOptions.webVersion = webVersion;
      switch (webVersionCacheType.toLowerCase()) {
        case 'local':
          clientOptions.webVersionCache = { type: 'local' };
          break;
        case 'remote':
          clientOptions.webVersionCache = {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/' + webVersion + '.html',
          };
          break;
        default:
          clientOptions.webVersionCache = { type: 'none' };
      }
    }

    const client = new Client(clientOptions);
    client.initialize().catch(err => console.log('Initialize error:', err.message));

    initializeEvents(socket,client, sessionId);
    sessions.set(sessionId, client);

    return { success: true, message: 'Session initiated successfully', client };
  } catch (error) {
    return { success: false, message: (error as Error).message, client: null };
  }
};

// Function to initialize events for a session
const initializeEvents = (socket: WebSocket,client: Client, sessionId: string) => {
 // const sessionWebhook = process.env[sessionId.toUpperCase() + '_WEBHOOK_URL'] || baseWebhookURL;

  if (recoverSessions) {
    waitForNestedObject(client, 'pupPage').then(() => {
      const restartSession = async (sessionId: string) => {
        sessions.delete(sessionId);
        await client.destroy().catch(() => {});
        setupSession(sessionId);
      };

      client.pupPage.once('close', () => {
        console.log(`Browser page closed for ${sessionId}. Restoring`);
        restartSession(sessionId);
      });

      client.pupPage.once('error', () => {
        console.log(`Error occurred on browser page for ${sessionId}. Restoring`);
        restartSession(sessionId);
      });
    });
  }

  checkIfEventisEnabled('auth_failure').then(() => {
    client.on('auth_failure', (msg: string) => {
      tiggerWS( sessionId, 'status', { msg });
    });
  });

  // Additional event listeners can be initialized similarly...

  client.on('qr', (qr: string) => {
    //client.qr = qr;
    checkIfEventisEnabled('qr').then(() => {
      const qrImage = await qrcode.toDataURL(qr);
      socket.send(JSON.stringify({ type: 'qr', qr: qrImage }));
      //tiggerWS( sessionId, 'qr',  qr:qrImage );
    });
  });

  checkIfEventisEnabled('ready').then(() => {
    client.on('ready', () => {
      //tiggerWS( sessionId, 'ready');
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ready', message: 'WhatsApp is ready!' }));
      }
    });
  });
};

// Function to delete the client session folder
const deleteSessionFolder = async (sessionId: string): Promise<void> => {
  try {
    const targetDirPath = path.join(sessionFolderPath, `session-${sessionId}`);
    const resolvedTargetDirPath = await fs.promises.realpath(targetDirPath);
    const resolvedSessionPath = await fs.promises.realpath(sessionFolderPath);

    if (!resolvedTargetDirPath.startsWith(`${resolvedSessionPath}${path.sep}`)) {
      throw new Error('Invalid path: Directory traversal detected');
    }

    await fs.promises.rm(resolvedTargetDirPath, { recursive: true, force: true });
  } catch (error) {
    console.error('Folder deletion error', error);
    throw error;
  }
};

// Other functions for reloading sessions, deleting sessions, and flushing sessions...

export  {
  sessions,
  setupSession,
  restoreSessions,
  validateSession,
  deleteSession,
  reloadSession,
  flushSessions
};