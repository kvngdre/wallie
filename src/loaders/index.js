import { initializeApp } from './app.loader.js';
import { connectDatabase } from './db.loader.js';

export default {
  /**
   *
   * @param {import('express').Application} expressApp
   * @param {import('./jsdoc/getAppRoutes.js').getAppRoutes} expressRoutes
   */
  startApp: async (expressApp = null, expressRoutes = null) => {
    await connectDatabase();
    initializeApp(app);
  },
};
