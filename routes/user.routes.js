const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/', async (req, res) => {
    const newUser = await userController.createUser(req.body);

    return res.status(201).send(newUser);
});

module.exports = router;