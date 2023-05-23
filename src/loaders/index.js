import { db } from '../db/index.js';
import { initializeApp } from './app.loader.js';

export default {
  /**
   *
   * @param {import('express').Application} expressApp
   * @param {import('./type/getAppRoutes.js').getAppRoutes} appRoutes
   */
  startApp: async (expressApp = null, appRoutes = null) => {
    initializeApp(expressApp, appRoutes);
  },
};
