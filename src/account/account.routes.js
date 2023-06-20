import { Router } from 'express';
import validateId from '../middleware/validateId.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import TokenRepository from '../token/token.repository.js';
import TransactionRepository from '../transaction/transaction.repository.js';
import TransactionValidator from '../transaction/transaction.validator.js';
import UserRepository from '../user/user.repository.js';
import EmailService from '../utils/emailService.utils.js';
import AccountController from './account.controller.js';
import AccountRepository from './account.repository.js';
import AccountService from './account.service.js';
import AccountValidator from './account.validator.js';

//* Creating dependency instances
const accountRepository = new AccountRepository();
const accountValidator = new AccountValidator();
const userRepository = new UserRepository();
const transactionRepository = new TransactionRepository();
const transactionValidator = new TransactionValidator();
const tokenRepository = new TokenRepository();
const emailService = new EmailService();

//* Injecting dependencies
const accountService = new AccountService(
  accountRepository,
  userRepository,
  transactionRepository,
  tokenRepository,
  emailService,
);
const accountController = new AccountController(
  accountService,
  accountValidator,
  transactionValidator,
);

const router = Router();

router.post('/', verifyToken, accountController.createAccount);

router.post(
  '/:accountId/transactions',
  verifyToken,
  validateId,
  accountController.postTransaction,
);

router.post(
  '/request-pin-reset',
  verifyToken,
  accountController.requestPinReset,
);

router.get('/', verifyToken, accountController.getAccounts);

router.get(
  '/:accountId',
  verifyToken,
  validateId,
  accountController.getAccount,
);

router.get(
  '/:accountId/balance',
  verifyToken,
  validateId,
  accountController.getBalance,
);

router.get(
  '/:accountId/transactions',
  verifyToken,
  validateId,
  accountController.getTransactions,
);

router.put(
  '/:accountId/pin',
  verifyToken,
  validateId,
  accountController.changeAccountPin,
);

router.delete(
  '/:accountId',
  verifyToken,
  validateId,
  accountController.deleteAccount,
);

export default router;
