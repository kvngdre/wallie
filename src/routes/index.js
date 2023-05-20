import { Router } from 'express';
import userRoutes from '../user/user.routes';
import accountRoutes from './account.routes';
import authRoutes from './auth.routes';
import transactionRoutes from './transaction.routes';

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
