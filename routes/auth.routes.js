const authController = require('../controllers/auth.controller');
const router = require('express').Router();

router.post('/login', async (req, res) => {
    const user = await authController.login(req.body);
    return res.status(user.code).send(user.payload);
});

module.exports = router;
