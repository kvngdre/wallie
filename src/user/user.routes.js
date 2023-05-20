const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Router = require('express').Router;
const UserController = require('../controllers/user.controller');
const validateId = require('../middleware/validateId');

const router = Router();

router.post('/signup', UserController.createUser);

router.get('/', [auth, isAdmin], UserController.getAllUsers);

router.get('/me', [auth], UserController.getCurrentUser);

router.get('/:id', [auth, isAdmin, validateId], UserController.getUser);

router.patch('/', [auth], UserController.updateUser);

router.delete('/:id', [auth, isAdmin, validateId], UserController.deleteUser);

module.exports = router;
