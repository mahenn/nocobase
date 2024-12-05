/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Service } from '@nocobase/server';
import { Repository } from '@nocobase/database';

interface SessionData {
  sessionId: string;
  id: string;
  data: string;
}

export class SessionService {
  private repository: Repository;

  constructor(app: any) {
    this.app = app;
  }
  
  async initialize() {
    this.repository = this.app.db.getRepository('sessions');
  }

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
