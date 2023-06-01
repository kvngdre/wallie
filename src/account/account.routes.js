import { Router } from 'express';
import validateId from '../middleware/validateId.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
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

router.post('/debit', verifyToken, accountController.debitAccount);

router.post('/fund', verifyToken, accountController.fundAccount);

router.post('/transfer-funds', verifyToken, accountController.transferFunds);

router.get('/', accountController.getAccounts);

router.get('/balance', verifyToken, accountController.getBalance);

router.get('/:accountId', validateId, accountController.getAccount);

router.patch('/change-pin', accountController.changeAccountPin);

router.delete('/:accountId', validateId, accountController.deleteAccount);

export default router;
