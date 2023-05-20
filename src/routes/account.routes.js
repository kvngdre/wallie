import { Router } from 'express';
import AccountController from '../controllers/account.controller.js';
import auth from '../middleware/auth.middleware.js';
import validateId from '../middleware/validateId.middleware.js';

const router = Router();
const accountController = new AccountController();

router.post('/new', auth, accountController.createAccount);

router.get('/', auth, accountController.getAllAccounts);

router.get('/balance', auth, accountController.getBalance);

router.get('/me', auth, accountController.getCurrentUserAccount);

router.get('/:id', auth, validateId, accountController.getAccount);

router.patch('/', auth, accountController.updateAccount);

router.delete('/:id', auth, validateId, accountController.deleteAccount);

router.post('/debit', auth, accountController.debitAccount);

router.post('/fund', auth, accountController.fundAccount);

router.post('/transfer-funds', auth, accountController.transferFunds);

export default router;
