import Router from 'express';
import auth from '../middleware/auth.middleware.js';
import validateId from '../middleware/validateId.middleware.js';
import TransactionController from './transaction.controller.js';

const router = Router();
const transactionController = new TransactionController();

router.post('/new', auth, transactionController.createTransaction);

router.get('/', auth, transactionController.getAllTransactions);

router.get('/:id', auth, validateId, transactionController.getTransaction);

router.patch('/:id', auth, validateId, transactionController.updateTransaction);

router.delete(
  '/:id',
  auth,
  validateId,
  transactionController.deleteTransaction,
);

export default router;