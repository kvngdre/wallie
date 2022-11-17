const router = require('express').Router();
const ServerError = require('../utils/serverresponse');
const userController = require('../controllers/user.controller');
const userValidators = require('../validators/user.validator');

router.post('/', async (req, res) => {
    const { error, value: userDTO } = userValidators.validateCreate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newUser = await userController.createUser(userDTO);
    if (newUser instanceof ServerError)
        return res.status(newUser.code).send(newUser.message);

    return res.status(201).send(newUser);
});

router.get('/', async (req, res) => {
    const users = await userController.getUsers();
    if (users instanceof ServerError)
        return res.status(users.code).send(users.message);

    return res.status(200).send(users);
});

router.get('/:id', async (req, res) => {
    const user = await userController.getUser(req.params.id);
    if (user instanceof ServerError)
        return res.status(user.code).send(user.message);

    return res.status(200).send(user);
});

router.patch('/:id', async (req, res) => {
    const { error, value: userDTO } = userValidators.validateEdit(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userController.updateUser(req.params.id, userDTO);
    if (user instanceof ServerError)
        return res.status(user.code).send(user.message);

    return res.status(200).send(user);
});

router.delete('/:id', async (req, res) => {
    const response = await userController.deleteUser(req.params.id);
    if (response instanceof ServerError)
        return res.status(response.code).send(response.message);

    return res.status(204).send(response);
});

module.exports = router;
