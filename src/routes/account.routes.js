const AccountController = require('../controllers/account.controller');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Router = require('express').Router;
const validateId = require('../middleware/validateId');

const router = Router();

router.post('/new', [auth], AccountController.createAccount);

router.get('/', [auth, isAdmin], AccountController.getAllAccounts);

router.get('/balance', [auth], AccountController.getBalance);

router.get('/me', [auth], AccountController.getCurrentUserAccount);

router.get('/:id', [auth, isAdmin, validateId], AccountController.getAccount);

router.post('/debit', [auth], AccountController.debitAccount);

router.post('/fund', [auth], AccountController.fundAccount);

router.post('/transfer-funds', [auth], AccountController.transferFunds);

router.delete('/:id', [auth, isAdmin, validateId], AccountController.deleteAccount);

module.exports = router;
