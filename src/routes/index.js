import { Router } from 'express';
import userRoutes from '../user/user.routes.js';
import accountRoutes from './account.routes.js';
import authRoutes from './auth.routes.js';
import transactionRoutes from './transaction.routes.js';

/**
 *
 *@type {import('../loaders/jsdoc/getAppRoutes').getAppRoutes}
 */
export default function appRoutes() {
  const router = Router();

  router.use('/accounts', accountRoutes);
  router.use('/auth', authRoutes);
  router.use('/transactions', transactionRoutes);
  router.use('/users', userRoutes);

  return router;
}
