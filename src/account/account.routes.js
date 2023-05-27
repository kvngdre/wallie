import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import validateId from '../middleware/validateId.middleware.js';
import UserRepository from '../user/user.repository.js';
import UserService from '../user/user.service.js';
import AccountController from './account.controller.js';
import AccountRepository from './account.repository.js';
import AccountService from './account.service.js';
import AccountValidator from './account.validator.js';

// * Creating dependency instances
const accountRepository = new AccountRepository();
const accountValidator = new AccountValidator();
const userRepository = new UserRepository();

// * Injecting dependencies
const accountService = new AccountService(accountRepository, userRepository);
const accountController = new AccountController(
  accountService,
  accountValidator,
);

const router = Router();

router.post('/', accountController.createAccount);

router.post('/debit', auth, accountController.debitAccount);

router.post('/fund', auth, accountController.fundAccount);

router.post('/transfer-funds', auth, accountController.transferFunds);

router.get('/', accountController.getAccounts);

router.get('/balance', auth, accountController.getBalance);

router.get('/me', auth, accountController.getCurrentUserAccount);

router.get('/:accountId', validateId, accountController.getAccount);

router.patch('/', auth, accountController.updateAccount);

router.delete('/:id', auth, validateId, accountController.deleteAccount);

export default router;
