import Router from 'express';
import TxnController from '../controllers/transaction.controller.js';
import auth from '../middleware/auth.middleware.js';
import validateId from '../middleware/validateId.middleware.js';

const router = Router();

router.post('/new', auth, TxnController.createTransaction);

router.get('/', auth, TxnController.getAllTransactions);

router.get('/:id', auth, validateId, TxnController.getTransaction);

router.patch('/:id', auth, validateId, TxnController.updateTransaction);

router.delete('/:id', auth, validateId, TxnController.deleteTransaction);

export default router;
