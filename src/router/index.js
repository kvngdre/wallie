import { Router } from 'express';
import accountRoutes from '../account/account.routes.js';
import sessionRoutes from '../session/session.routes.js';
import transactionRoutes from '../transaction/transaction.routes.js';
import userRoutes from '../user/user.routes.js';

/**
 * @function createAppRouter
 * @description A function that creates an express router with the app routes.
 * @requires module:express.Router
 * @returns {Router} The express router with the app routes.
 */
export default function createAppRouter() {
  const router = Router();

  router.use('/accounts', accountRoutes);
  router.use('/session', sessionRoutes);
  router.use('/transactions', transactionRoutes);
  router.use('/users', userRoutes);

  return router;
}
