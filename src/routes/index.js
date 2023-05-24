import { Router } from 'express';
import accountRoutes from '../account/account.routes.js';
import authRoutes from '../auth/auth.routes.js';
import transactionRoutes from '../transaction/transaction.routes.js';
import userRoutes from '../user/user.routes.js';

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
