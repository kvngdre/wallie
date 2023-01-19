const Router = require('express').Router;
const userController = require('../controllers/user.controller');
const auth = require('../middleware/isAuth');
const validateId = require('../middleware/validateId');

const router = Router();

router.post('/new', userController.createUser);

router.get('/', [auth], userController.getUsers);

router.get('/:id', [auth, validateId], async (req, res) => {
    const user = await userController.getUser(req.params.id);
    return res.status(user.code).send(user.payload);
});

router.patch('/:id', [auth], async (req, res) => {
    const user = await userController.updateUser(req.params.id, req.body);
    return res.status(user.code).send(user.payload);
});

router.delete('/:id', [auth], async (req, res) => {
    const response = await userController.deleteUser(req.params.id);
    return res.status(response.code).send(response.payload);
});

module.exports = router;
