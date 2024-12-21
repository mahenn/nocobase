import { Plugin } from '@nocobase/server';
import { Gateway } from '../../../../../core/server/src/gateway/index';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import path from 'path';
import fs from 'fs-extra';




export class WhatsAppPlugin extends Plugin {
  
  private sessions = new Map<string, Client>();

  async load() {
    const gateway = Gateway.getInstance();

    if (!gateway.wsServer || !gateway.wsServer.wss) {
      console.error('WebSocket is not initialized on the server side');
      return;
    }

    const wsServer = gateway.wsServer.wss;



    wsServer.on('connection', async (socket) => {

    console.log('Client connected to WebSocket');

    await this.initializeOrReuseSession(socket, "phone-123");

      socket.on('message', async (message: string) => {
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message);
        } catch (error) {
          console.error('Non-JSON message received:', message);
          return;
        }

        try{
        const { sessionId, type, chatId, content,offset } = parsedMessage;

        console.log("paresedMessage",sessionId,type,chatId,content,offset);

        if (!sessionId) {
          console.error('No sessionId found in message');
          return;
        }



        switch (type) {
          case 'start-session':
            console.log('start-session event received, checking WhatsApp session status...');
             socket.send(JSON.stringify({ type: 'ready', message: 'WhatsApp is ready!' }));
           // await this.initializeOrReuseSession(socket, sessionId);
            break;

          case 'logout':
           // console.log(`Logging out session: ${sessionId}`);
            await this.logoutFromWhatsApp(socket, sessionId);
            break;

          case 'get-messages':
            await this.fetchMessagesForChat(socket, chatId, sessionId,offset);
            break;

          case 'send-message':
          //  console.log(`Send message event received for session: ${sessionId}`);
            await this.sendChat(socket, chatId, content, sessionId);
            break;

          case 'new-message':
            console.log(`new message received : ${sessionId}`,content);
            await this.handleSendMessage(socket, chatId, content, sessionId);
            break;

          case 'get-contacts':
         //   console.log(`Fetching contacts for session: ${sessionId}`);
            await this.sendContacts(socket, sessionId);
            break;

          case 'get-chats':
          //  console.log(`Fetching chats for session: ${sessionId}`);
            await this.sendChats(socket, sessionId);
            break;
          case 'react-to-message':
            await this.handleWhatsAppOperation(socket, chatId, content,sessionId, () => this.handleReactToMessage(socket, chatId, content, sessionId));
            break;

          default:
            console.warn('Unhandled event type:', type);
        }

        }catch(error){
        console.log("error in pase message");
      }
      });
    });
  }
 
  private async handleReactToMessage(socket: WebSocket, chatId: string, content: any, sessionId: string) {
    
    const client = this.sessions.get(sessionId);
    
    if (!client) {
      console.error(`Session not found for sessionId: ${sessionId}`);
      return;
    }

    try {
      const { messageId, emoji } = content;

      const msg = await client.getMessageById(messageId);
      
      if (msg) {
        await msg.react(emoji);
        const reactions = await msg.getReactions();

        socket.send(JSON.stringify({
          type: 'message-reacted',
          chatId,
          msg
        }));
      }
    } catch (error) {
      console.error('Error reacting to message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Error reacting to message.',
      }));
    }
  }

  private waitForNestedObject(rootObj: any, nestedPath: string, maxWaitTime = 20000, interval = 100): Promise<void> {
    const start = Date.now();

    return new Promise((resolve, reject) => {
      const checkObject = () => {
        const nestedObj = nestedPath.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), rootObj);
        if (nestedObj) {
          resolve();
        } else if (Date.now() - start > maxWaitTime) {
          console.error(`Timed out waiting for nested object: ${nestedPath} in root object after ${maxWaitTime} ms`);
          reject(new Error(`Timeout waiting for nested object: ${nestedPath}`));
        } else {
          setTimeout(checkObject, interval);
        }
      };
      checkObject();
    });
  }



  // Initialize or reuse session
  private async initializeOrReuseSession(socket: WebSocket, sessionId: string) {

    console.log('Initializing WhatsApp client...', sessionId);
  
     const lockFilePath = path.resolve(`./wwebjs_auth/session-${sessionId}/SingletonLock`);

     try {
        await fs.promises.unlink(lockFilePath);
        console.log(`Deleted existing lock file: ${lockFilePath}`);
      } catch (error) {
        console.error(`Failed to remove lock file: ${lockFilePath}`);
      }



    try {
      if (this.sessions.has(sessionId)) {
        console.log("Session already exist",sessionId,socket.readyState === WebSocket.OPEN);

        // if (socket.readyState === WebSocket.OPEN) {
        //   socket.send(JSON.stringify({ type: 'ready', message: 'WhatsApp is ready!' }));
        // }

        //client.initialize().catch(err => console.log('Initialize error:', err.message));

        return;
        //return { success: false, message: `Session already exists for: ${sessionId}`, client: sessions.get(sessionId) };
      }

      console.log("new Session starting",sessionId);

      const localAuth = new LocalAuth({ clientId: sessionId, dataPath: './wwebjs_auth' });
      localAuth.logout = () => {};

      const clientOptions: any = {
        puppeteer: {
          executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
        },
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        authStrategy: localAuth,
      };

      // if (webVersion) {
      //   clientOptions.webVersion = webVersion;
      //   switch (webVersionCacheType.toLowerCase()) {
      //     case 'local':
      //       clientOptions.webVersionCache = { type: 'local' };
      //       break;
      //     case 'remote':
      //       clientOptions.webVersionCache = {
      //         type: 'remote',
      //         remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/' + webVersion + '.html',
      //       };
      //       break;
      //     default:
      //       clientOptions.webVersionCache = { type: 'none' };
      //   }
      // }

      const client = new Client(clientOptions);
      client.initialize().catch(err => console.log('Initialize error:', err.message));
      //await client.initialize().catch(err => console.log('Initialize error:', err.message));;

      this.attachListeners(socket, client, sessionId);
      this.sessions.set(sessionId, client);
      //console.log("sending ready event");
      //socket.send(JSON.stringify({ type: 'ready', message: 'WhatsApp is ready!' }));
      return;

    } catch (error) {
      socket.send(JSON.stringify({ type: 'error', message: error.message }));
      //return { success: false, message: (error as Error).message, client: null };
    }

    // const lockFilePath = path.resolve(`./.wwebjs_auth/${sessionId}/SingletonLock`);

    //  try {
    //     await fs.promises.unlink(lockFilePath);
    //     console.log(`Deleted existing lock file: ${lockFilePath}`);
    //   } catch (error) {
    //     console.error(`Failed to remove lock file: ${lockFilePath}`);
    //   }

    // if (existingClient) {
    //   console.log(`Reusing session for: ${sessionId}`);

    //  // await existingClient.initialize();

    //   this.attachListeners(socket, existingClient, sessionId);
    //   console.log(`Listners attached: ${sessionId}`);

    //   if (socket.readyState === WebSocket.OPEN) {
    //     socket.send(JSON.stringify({ type: 'ready', message: 'WhatsApp is ready!' }));
    //   }
    //   return;
    // }
    // console.log('Initializing new WhatsApp client...');
    // const whatsappClient = new Client({
    //   authStrategy: new LocalAuth({
    //     clientId: sessionId, authenticated: true
    //     //dataPath: './whatsapp-sessions'
    //   }),
    //   puppeteer: {
    //     headless: true,
    //     executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
    //     args: [
    //       '--disable-background-timer-throttling', // Prevent background tab timeout
    //       '--disable-backgrounding-occluded-windows', // Keep session alive even when inactive
    //       '--disable-renderer-backgrounding', // Prevent session termination due to inactivity
    //       '--no-sandbox',
    //       '--disable-setuid-sandbox',
    //       '--disable-dev-shm-usage', // Helps to avoid Chrome crashes
    //       // '--disable-accelerated-2d-canvas',
    //       // '--no-first-run',
    //       // '--no-zygote',
    //       // '--disable-features=VizDisplayCompositor',
    //       // '--single-process=false', // Single-process mode can help avoid crashes in some cases
    //       // '--disable-gpu',
    //       // '--disable-software-rasterizer',
    //     ],
    //     timeout: 0, // No timeout
    //   },

    // }); 

    // this.sessions.set(sessionId, whatsappClient); // Store the session
    // console.log('WhatsApp session authenticated & session stored for next use');

    // this.attachListeners(socket, whatsappClient, sessionId);

    // try {
    //   await whatsappClient.initialize();
    //   console.log('WhatsApp client initialized and session established');

    // } catch (error) {
    //   console.error('Error initializing WhatsApp client:', error);
    //   socket.send(JSON.stringify({
    //     type: 'error',
    //     message: 'Error initializing WhatsApp client. Please try again later.',
    //   }));
    // }
  }

  // Attach listeners for WhatsApp client
  private attachListeners(socket: WebSocket, client: Client, sessionId: string) {
    // Clean up any existing listeners for this client to avoid memory leaks
    client.removeAllListeners();

    // this.waitForNestedObject(client, 'pupPage').then(() => {
    //     const restartSession = async (sessionId: string) => {
    //       console.log("restart session");
    //       this.sessions.delete(sessionId);
    //       await client.destroy().catch(() => {});
    //       this.initializeOrReuseSession(sessionId);
    //     };

    //     client.pupPage.once('close', () => {
    //       console.log(`Browser page closed for ${sessionId}. Restoring`);
    //       restartSession(sessionId);
    //     });

    //     client.pupPage.once('error', () => {
    //       console.log(`Error occurred on browser page for ${sessionId}. Restoring`);
    //       restartSession(sessionId);
    //     });
    //   });


    client.on('qr', async (qr: string) => {
      console.log('QR code generated:', qr);
      const qrImage = await qrcode.toDataURL(qr);
      console.log(socket.readyState , WebSocket.OPEN);
      //if (socket.readyState === WebSocket.OPEN) {
        console.log(qrImage);
        socket.send(JSON.stringify({ type: 'qr', qr: qrImage }));
     // }
    });

    client.on('ready', async () => {
      console.log(`WhatsApp client ready for session: ${sessionId}`);

      client.pupPage.on('pageerror', function(err) {
        console.log('i am Page error: ' + err.toString());
      });

      client.pupPage.on('error', function(err) {
          console.log('i am Page error: ' + err.toString());
      });


      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ready', message: 'WhatsApp is ready!' }));
      }
    });

    client.on('authenticated', async () => {
      
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ready', message: 'WhatsApp session authenticated!' }));
      }
    });

    client.on('call', async (call) => {
      console.log('Call received', call);
     // if (rejectCalls) await call.reject();
      //await client.sendMessage(call.from, `[${call.fromMe ? 'Outgoing' : 'Incoming'}] Phone call from ${call.from}, type ${call.isGroup ? 'group' : ''} ${call.isVideo ? 'video' : 'audio'} call. ${rejectCalls ? 'This call was automatically rejected by the script.' : ''}`);
    });

    client.on('message', async (message) => {
      console.log('New message received:', message);

      try {

        // If the message contains media
        if (message.hasMedia ) {
          const media = await message.downloadMedia();
          
          // If media is successfully downloaded
          const mediaData = media && media.data ? media.data : null;
          const mediaType = media && media.mimetype ? media.mimetype : null;

          // Construct the message with media data
          const newMediaMessage = {
            ...message, // Keep all original message attributes
            mediaData, // Only add media data if available
            mediaType, // Add media type (e.g., image/jpeg)
          };

          if (socket.readyState === WebSocket.OPEN) {
            // Send the media message
            socket.send(JSON.stringify({
              type: 'new-media-message',
              chatId: message.from,
              message: newMediaMessage, // Pass the full message object including media data
            }));
          }
        } else {
          // Handle non-media messages
          if (socket.readyState === WebSocket.OPEN) {
            // Send the original message without any modification
            socket.send(JSON.stringify({
              type: 'new-message',
              message: message, // Pass the original message object
              chatId: message.from,
            }));
          }
        }
      } catch (error) {

        console.error('Error handling message:', message,error);

        // if (socket.readyState === WebSocket.OPEN) {
        //   socket.send(JSON.stringify({
        //     type: 'error',
        //     message: 'Error processing message. Please try again.',
        //   }));
        // }
      }
    });

    client.on('disconnected', async (reason) => {
      console.log('WhatsApp disconnected. Reason:', reason);
      //this.sessions.delete(sessionId);

      if (reason === 'PUPPETEER_DISCONNECTED' || reason === 'CONNECTION_LOST') {
        console.log('Attempting to restart the WhatsApp session...');
        await this.initializeOrReuseSession(socket, sessionId); // Reinitialize the session
        return;
      }

      if (reason === 'NAVIGATION' || reason === 'BROWSER_CLOSE') {
        console.log('Attempting to restart the WhatsApp session...');
        //await this.closeSession(sessionId);
        await this.initializeOrReuseSession(socket, sessionId);
        return;
      } 

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'disconnected',
          message: 'WhatsApp session disconnected. Please scan the QR code to reconnect.',
        }));
      }
      await client.logout();  // Log out and clear session
    });

    client.on('auth_failure', async () => {
      console.error('Authentication failure, restarting session.');
      //this.sessions.delete(sessionId);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Authentication failed. Please rescan the QR code.',
        }));
      }
    });

    // client.puppeteer.on('disconnected', () => {
    //   console.log('Puppeteer browser disconnected, attempting to restart');
    //   // Logic to restart the browser and client
    //   client.initialize();
    // });


  }








  // Fetch contacts separately
  private async sendContacts(socket: WebSocket, sessionId: string) {
    const client = this.sessions.get(sessionId);
    if (!client) {
      console.error(`Session not found for sessionId: ${sessionId}`);
      return;
    } 

    try {
      const contacts = await client.getContacts();
      console.log(`Contacts for sessionId: ${sessionId}`, contacts.length);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'contacts',
          contacts,
        }));
      }
    } catch (error) {
      console.error(`Error fetching contacts for sessionId: ${sessionId}`, error.message);
    }
  }

  // Fetch chats separately
  private async sendChats(socket: WebSocket, sessionId: string) {

    const client = this.sessions.get(sessionId);
    
    if (!client) {
      console.error(`Session not found for sessionId: ${sessionId}`);
      return;
    }

    try {
      const chats = await client.getChats();
      //chats.sendSeen();
      console.log(`Chats for sessionId: ${sessionId}`, chats.length);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'chats',
          chats,
        }));
      }
    } catch (error) {
      console.log(client);
      console.error(`Error fetching chats for sessionId: ${sessionId}`, error.message);

     // await this.initializeOrReuseSession(socket, sessionId);


      // if (socket.readyState === WebSocket.OPEN) {
      //   socket.send(JSON.stringify({
      //     type: 'error',
      //     message: 'Error fetching chats.',
      //   }));
      // }
    }
  }

    // Fetch messages for a specific chat and download media
  private async fetchMessagesForChat(socket: WebSocket, chatId: string, sessionId: string, offset = 0) {
    const client = this.sessions.get(sessionId);
    if (!client) {
      console.error(`Session not found for sessionId: ${sessionId} `);
      return;
    }

    try {
      const chat = await client.getChatById(chatId);
      console.error(`fetching messages for offset: ${offset}`);
      const messages = await chat.fetchMessages();

      const processedMessages = await Promise.all(
        messages.map(async (message) => {
          let reactions = [];
          if (message.hasReaction) {
            try {
              reactions = await message.getReactions();
            } catch (error) {
              console.error(`Error fetching reactions for message: ${message.id._serialized}`, error);
            }
          }

          if (message.hasMedia) {
            try {
              const media = await message.downloadMedia();
               return {
              ...message,
              mediaData: media && media.data ? media.data : null, // Base64-encoded media data or null
              mediaType: media && media.mimetype ? media.mimetype : null, // Mime type or null
            };
          } catch (error) {
            console.error(`Error downloading media for message: ${message.id._serialized}`, error);
            return {
              ...message,
              mediaData: null,
              mediaType: null,
                reactions
              };
            }
          }

          return {
            ...message,
            reactions, // Add reactions if available
          };
        })
      );

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'messages',
          chatId,
          messages: processedMessages, // Send processed messages including media data
        }));
      }
    } catch (error) {
      console.error(`Error fetching messages for chatId: ${chatId}`, error.message);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Error fetching messages.',
        }));
      }
    }
  }

  // Handle sending a message
  private async handleSendMessage(socket: WebSocket, chatId: string, content: any, sessionId: string) {
    const client = this.sessions.get(sessionId);
    if (!client) {
      console.error(`Session not found for sessionId: ${sessionId}`);
      return;
    }

    let message;
    try {
      let options: any = {};
      if (content.replyTo) {
        const quotedMessage = await client.getMessageById(content.replyTo._serialized);
        if (quotedMessage) {
          options.quotedMessageId = quotedMessage.id._serialized;
        }
      }
      if (content.type === 'text') {
        message = await client.sendMessage(chatId, content.content, options);
      } else if (content.type === 'media') {
        // Handle media message
        const media = new MessageMedia(content.media.mimetype, content.content, content.media.filename);
        message = await client.sendMessage(chatId, media, { caption: content.media.caption || '', ...options });
      } else {
        message = await client.sendMessage(chatId, content.content, options);
        console.log("Sent other message", message);
      }

      socket.send(JSON.stringify({ type: 'message-sent', chatId, message }));
    } catch (error) {
      console.error('Error sending message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Error sending message.',
      }));
    }
  }

  // Properly logout from WhatsApp and clear session
  private async logoutFromWhatsApp(socket: WebSocket, sessionId: string) {
    const client = this.sessions.get(sessionId);
    if (!client) {
      console.error(`Session not found for sessionId: ${sessionId}`);
      return;
    }

    try {
      console.log(`Logging out session: ${sessionId}`);
      await client.logout();
      this.sessions.delete(sessionId);
      socket.send(JSON.stringify({ type: 'logout-success', message: 'Successfully logged out.' }));
    } catch (error) {
      console.error('Error during logout:', error);
      socket.send(JSON.stringify({ type: 'error', message: 'Error logging out.' }));
    }
  }

  async afterDisable() {
    for (const [sessionId, client] of this.sessions) {
      try {
        console.log(`Closing session for: ${sessionId}`);
        await client.logout();
        this.sessions.delete(sessionId);
      } catch (error) {
        console.error(`Error closing session for: ${sessionId}`, error);
      }
    }
  }
}

export default WhatsAppPlugin;