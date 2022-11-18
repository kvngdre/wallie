const authController = require('../controllers/auth.controller');
const router = require('express').Router();
const userValidators = require('../validators/user.validator');

router.post('/login', async (req, res) => {
    const { value: userDTO, error } = userValidators.validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await authController.login(userDTO);
    if (user.isError) return res.status(user.code).send(user.payload);

    return res.status(user.code).send(user.payload);
});

module.exports = router;
