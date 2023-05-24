import { initializeApp } from './app.loader.js';
import { connectDatabase } from './db.loader.js';

export default {
  /**
   *
   * @param {import('express').Application} expressApp
   * @param {import('./type/getAppRoutes.js').getAppRoutes} appRoutes
   */
  startApp: async (expressApp = null, appRoutes = null) => {
    await connectDatabase();
    initializeApp(expressApp, appRoutes);
  },
};
