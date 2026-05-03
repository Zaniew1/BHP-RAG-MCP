import { PORT, NODE_ENV } from '../utils/constants';
import { Express } from 'express';

/**
 * This function starts a server but only if NODE_ENV is prod or dev
 * In future, different databases will be run depending on NODE_ENV(prod, dev, test)
 *
 * @async
 * @param {Express} application
 * @returns {*}
 */
export const startServer = async (application: Express) => {
  if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'prod') {
    application.listen(PORT, async () => {
      console.log('Server running on port: ' + PORT + ' on ' + NODE_ENV + ' environment');
    });
  }
};
