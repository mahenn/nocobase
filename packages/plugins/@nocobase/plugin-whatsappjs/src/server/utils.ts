//import axios from 'axios';
import { disabledCallbacks } from './config';
//import { Response } from 'express'; // Assuming you're using Express for your server

// Type definitions
// interface WebhookData {
//   dataType: string;
//   data: any;
//   sessionId: string;
// }

// Trigger socket 
const triggerWS = (socket: WebSocket, sessionId: string, dataType: string, data: any): void => {
  socket.send(JSON.stringify({ type: dataType, data})).catch((error: Error) => {
      console.error('Failed to send socket message :', sessionId, dataType, error.message, data || '');
    });
};

// Function to send a response with error status and message
// const sendErrorResponse = (res: Response, status: number, message: string): void => {
//   res.status(status).json({ success: false, error: message });
// };

// Function to wait for a specific item not to be null
const waitForNestedObject = (rootObj: any, nestedPath: string, maxWaitTime = 10000, interval = 100): Promise<void> => {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const checkObject = () => {
      const nestedObj = nestedPath.split('.').reduce((obj, key) => obj ? obj[key] : undefined, rootObj);
      if (nestedObj) {
        resolve();
      } else if (Date.now() - start > maxWaitTime) {
        console.log('Timed out waiting for nested object');
        reject(new Error('Timeout waiting for nested object'));
      } else {
        setTimeout(checkObject, interval);
      }
    };
    checkObject();
  });
};

// Function to check if an event is enabled
const checkIfEventisEnabled = (event: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!disabledCallbacks.includes(event)) {
      resolve();
    }
  });
};

export {
  triggerWS,
  //sendErrorResponse,
  waitForNestedObject,
  checkIfEventisEnabled
};