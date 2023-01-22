const accountController = require('../controllers/account.controller');
const router = require('express').Router();
const verifyToken = require('../middleware/auth');

router.post('/new', verifyToken, async (req, res) => {
    const newAccount = await accountController.createAccount(req.body);
    return res.status(newAccount.code).send(newAccount.payload);
});

router.get('/', verifyToken, async (req, res) => {
    const accounts = await accountController.getAccounts();
    return res.status(accounts.code).send(accounts.payload);
});

router.get('/balance', verifyToken, async (req, res) => {
    const balance = await accountController.getBalance(req.user.id);
    return res.status(balance.code).send(balance.payload);
});

router.get('/:id', verifyToken, async (req, res) => {
    const account = await accountController.getAccount(req.params.id);
    return res.status(account.code).send(account.payload);
});

router.delete('/:id', verifyToken, async (req, res) => {
    const response = await accountController.deleteAccount(req.params.id);
    return res.status(response.code).send(response.payload);
});

router.post('/fund', verifyToken, async (req, res) => {
    const response = await accountController.fundAccount(
        req.user.id,
        req.body.amount
    );
    return res.status(response.code).send(response.payload);
});

router.post('/debit', verifyToken, async (req, res) => {
    const response = await accountController.debitAccount(
        req.user.id,
        req.body.amount
    );
    return res.status(response.code).send(response.payload);
});

router.post('/transfer', verifyToken, async (req, res) => {
    const response = await accountController.transferFunds(
        req.user.id,
        req.body
    );
    return res.status(response.code).send(response.payload);
});

module.exports = router;
