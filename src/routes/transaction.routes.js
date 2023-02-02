const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Router = require('express').Router;
const TxnController = require('../controllers/transaction.controller');
const validateId = require('../middleware/validateId');

const router = Router();

router.post('/new', [auth, isAdmin], TxnController.createTransaction);

router.get('/', [auth], TxnController.getAllTransactions);

router.get('/:id', [auth, validateId], TxnController.getTransaction);

router.patch('/:id', [auth, isAdmin, validateId], TxnController.updateTransaction);

router.delete('/:id', [auth, isAdmin, validateId], TxnController.deleteTransaction);

module.exports = router;
