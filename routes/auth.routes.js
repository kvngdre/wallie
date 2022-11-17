const authController = require('../controllers/auth.controller');
const router = require('express').Router();
const userValidators = require('../validators/user.validator');

router.post('/login', async (req, res) => {
    const { value: userDTO, error } = userValidators.validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const response = await authController.login(userDTO);

    return res.status(200).send(response);
});

module.exports = router;
