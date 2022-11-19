const accountController = require('../controllers/account.controller');
const router = require('express').Router();

router.post('/new', async (req, res) => {
    const newAccount = await accountController.createAccount(req.body);
    return res.status(newAccount.code).send(newAccount.payload);
});

router.get('/', async (req, res) => {
    const accounts = await accountController.getAccounts();
    return res.status(accounts.code).send(accounts.payload);
});

router.get('/:id', async (req, res) => {
    const account = await accountController.getAccount(req.params.id);
    return res.status(account.code).send(account.payload);
});

router.patch('/:id', async (req, res) => {
    const account = await accountController.updateAccount(
        req.params.id,
        req.body
    );
    return res.status(account.code).send(account.payload);
});

router.delete('/:id', async (req, res) => {
    const response = await accountController.deleteAccount(req.params.id);
    return res.status(response.code).send(response.payload);
});

// fund wallet auth

// get balance auth

// withdraw auth

// transfer auth

module.exports = router;
