const { httpStatusCodes } = require('../utils/constants');
const authController = require('../controllers/auth.controller');
const router = require('express').Router();

router.post('/login', async (req, res) => {
    const response = await authController.login(req.body);
    return res.status(httpStatusCodes.OK).send(response);
});

module.exports = router;
