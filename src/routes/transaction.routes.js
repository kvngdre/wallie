const router = require('express').Router();
const txnController = require('../controllers/transaction.controller');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    const transactions = await txnController.getTransactions();
    return res.status(transactions.code).send(transactions.payload);
});

router.get('/:id', verifyToken, async (req, res) => {
    const transaction = await txnController.getTransaction(req.params.id);
    return res.status(transaction.code).send(transaction.payload);
});

module.exports = router;
