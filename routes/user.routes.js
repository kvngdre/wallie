const router = require('express').Router();
const userController = require('../controllers/user.controller');
const userValidators = require('../validators/user.validator');

router.post('/', async (req, res) => {
    const { error, value: userDTO } = userValidators.validateCreate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newUser = await userController.createUser(userDTO);
    if (newUser.isError) return res.status(newUser.code).send(newUser.payload);

    return res.status(newUser.code).send(newUser.payload);
});

router.get('/', async (req, res) => {
    const users = await userController.getUsers();
    if (users.isError) return res.status(users.code).send(users.payload);

    return res.status(users.code).send(users.payload);
});

router.get('/:id', async (req, res) => {
    const user = await userController.getUser(req.params.id);
    if (user.isError) return res.status(user.code).send(user.payload);

    return res.status(user.code).send(user.payload);
});

router.patch('/:id', async (req, res) => {
    const { error, value: userDTO } = userValidators.validateEdit(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userController.updateUser(req.params.id, userDTO);
    if (user.isError) return res.status(user.code).send(user.payload);

    return res.status(user.code).send(user.payload);
});

router.delete('/:id', async (req, res) => {
    const response = await userController.deleteUser(req.params.id);
    if (response.isError)
        return res.status(response.code).send(response.payload);

    return res.status(response.code).send(response.payload);
});

module.exports = router;
