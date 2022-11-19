const router = require('express').Router();
const txnController = require('../controllers/transaction.controller');

router.post('/new', async (req, res) => {
    const transaction = await txnController.createTransaction(req.body);
    return res.status(transaction.code).send(transaction.payload);

})

router.get('/', async (req, res) => {
    const transactions = await txnController.getTransactions();
    return res.status(transactions.code).send(transactions.payload);
});

router.get('/:id', async (req, res) => {
    const transaction = await txnController.getTransaction(req.params.id);
    return res.status(transaction.code).send(transaction.payload);
});

router.patch('/:id', async (req, res) => {
    const transaction = await txnController.updateTransaction(
        req.params.id,
        req.body
    );
    return res.status(transaction.code).send(transaction.payload);
});

router.delete('/:id', async (req, res) => {
    const response = await txnController.deleteTransaction(req.params.id);
    return res.status(response.code).send(response.payload);
});

module.exports = router;    