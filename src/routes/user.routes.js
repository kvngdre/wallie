const auth = require('../middleware/auth');
const Router = require('express').Router;
const UserController = require('../controllers/user.controller');
const validateId = require('../middleware/validateId');

const router = Router();

router.post('/new', UserController.createUser);

router.get('/', [auth], UserController.getUsers);

router.get('/:id', [auth, validateId], UserController.getUser);

router.patch('/:id', [auth, validateId], UserController.updateUser);

router.delete('/:id', [auth, validateId], UserController.deleteUser);

module.exports = router;
