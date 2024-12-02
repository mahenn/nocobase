/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { createLogger } from '@nocobase/logger';

export const logger = createLogger({
  name: 'plugin-whatsapp',
  match: 'whatsapp*',
  filename: 'whatsapp', // Add this line to specify the filename
  transports: ['console'], // Specify to use only console transport
});
