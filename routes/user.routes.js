const router = require('express').Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/verifyToken');

router.post('/new', async (req, res) => {
    const newUser = await userController.createUser(req.body);
    return res.status(newUser.code).send(newUser.payload);
});

router.get('/', verifyToken, async (req, res) => {
    const users = await userController.getUsers();
    return res.status(users.code).send(users.payload);
});

router.get('/:id', verifyToken, async (req, res) => {
    const user = await userController.getUser(req.params.id);
    return res.status(user.code).send(user.payload);
});

router.patch('/:id', verifyToken, async (req, res) => {
    const user = await userController.updateUser(req.params.id, req.body);
    return res.status(user.code).send(user.payload);
});

router.delete('/:id', verifyToken, async (req, res) => {
    const response = await userController.deleteUser(req.params.id);
    return res.status(response.code).send(response.payload);
});

module.exports = router;
