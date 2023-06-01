import Router from 'express';
import validateId from '../middleware/validateId.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import TransactionController from './transaction.controller.js';

const router = Router();
const transactionController = new TransactionController();

router.post('/new', verifyToken, transactionController.createTransaction);

router.get('/', verifyToken, transactionController.getAllTransactions);

router.get(
  '/:id',
  verifyToken,
  validateId,
  transactionController.getTransaction,
);

router.patch(
  '/:id',
  verifyToken,
  validateId,
  transactionController.updateTransaction,
);

router.delete(
  '/:id',
  verifyToken,
  validateId,
  transactionController.deleteTransaction,
);

export default router;
