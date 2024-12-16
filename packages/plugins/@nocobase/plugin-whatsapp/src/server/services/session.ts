/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Repository } from '@nocobase/database';
import { BufferJSON, initAuthCreds } from '@whiskeysockets/baileys';
import { logger } from '../utils/logger';

interface SessionData {
  sessionId: string;
  id: string;
  data: string;
  status?: string;
  lastStatusUpdate?: Date;
}

export class SessionService {

  private repository: Repository;
  private retries: Map<string, number>;
  private readonly MAX_RETRIES = 5;
  private readonly app = '';
  
  constructor(app: any) {
    this.app = app;
    this.retries = new Map();
  }

  async initialize() {
    this.repository = this.app.db.getRepository('sessions');
  }

  async updateSessionState(sessionId: string, state: any) {
    try {
      const data = JSON.stringify(state, BufferJSON.replacer);
      await this.repository.update({
        filter: {
          sessionId,
        },
        values: {
          state: data
        }
      });
    } catch (error) {
      logger.error('Failed to update session state:', error);
      throw error;
    }
  }

  async getSessionState(sessionId: string) {
    try {
      const session = await this.findById(sessionId);
      if (!session?.state) return null;
      return JSON.parse(session.state, BufferJSON.reviver);
    } catch (error) {
      logger.error('Failed to get session state:', error);
      return null;
    }
  }

  async updateSessionStatus(sessionId: string, status) {
    return await this.update(sessionId, {
      status,
      lastStatusUpdate: new Date()
    } as Partial<SessionData>);
  }

  /* need to check if below codes require*/
  async create(data: SessionData) {
    return await this.repository.create({
      values: data,
    });
  }

  async findById(sessionId: string) {
    return await this.repository.findOne({
      filter: {
        sessionId,
      },
    });
  }

  async update(sessionId: string, data: Partial<SessionData>) {
    return await this.repository.update({
      filter: {
        sessionId,
      },
      values: data,
    });
  }

  async delete(sessionId: string) {
    return await this.repository.destroy({
      filter: {
        sessionId,
      },
    });
  }

  async list() {
    return await this.repository.find();
  }
}

export default SessionService;
