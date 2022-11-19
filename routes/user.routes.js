const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/new', async (req, res) => {
    const newUser = await userController.createUser(req.body);
    return res.status(newUser.code).send(newUser.payload);
});

router.get('/', async (req, res) => {
    const users = await userController.getUsers();
    return res.status(users.code).send(users.payload);
});

router.get('/:id', async (req, res) => {
    const user = await userController.getUser(req.params.id);
    return res.status(user.code).send(user.payload);
});

router.patch('/:id', async (req, res) => {
    const user = await userController.updateUser(req.params.id, req.body);
    return res.status(user.code).send(user.payload);
});

router.delete('/:id', async (req, res) => {
    const response = await userController.deleteUser(req.params.id);
    return res.status(response.code).send(response.payload);
});

module.exports = router;
