import { Router } from 'express';
import AccountController from '../controllers/account.controller.js';
import auth from '../middleware/auth.middleware.js';
import validateId from '../middleware/validateId.middleware.js';

const router = Router();

router.post('/new', auth, AccountController.createAccount);

router.get('/', auth, AccountController.getAllAccounts);

router.get('/balance', auth, AccountController.getBalance);

router.get('/me', auth, AccountController.getCurrentUserAccount);

router.get('/:id', auth, validateId, AccountController.getAccount);

router.patch('/', auth, AccountController.updateAccount);

router.delete('/:id', auth, validateId, AccountController.deleteAccount);

router.post('/debit', auth, AccountController.debitAccount);

router.post('/fund', auth, AccountController.fundAccount);

router.post('/transfer-funds', auth, AccountController.transferFunds);

export default router;
