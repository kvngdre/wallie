const accountController = require('../controllers/account.controller');
const router = require('express').Router();


router.post('/new', async (req, res) => {
    const response = await accountController.createAccount(req.body);
    res.status(203).send(response.payload || response);
})


// fund wallet auth

// get balance auth

// withdraw auth

// transfer auth

module.exports = router;