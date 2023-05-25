import Router from 'express';
import AccountRepository from '../account/account.repository.js';
import auth from '../middleware/auth.middleware.js';
import validateId from '../middleware/validateId.middleware.js';
import UserController from '../user/user.controller.js';
import Logger from '../utils/logger.utils.js';
import UserRepository from './user.repository.js';
import UserService from './user.service.js';
import UserValidator from './user.validator.js';

// * Creating dependency instances
const userValidator = new UserValidator();
const userRepository = new UserRepository();
const accountRepository = new AccountRepository();

// * Injecting dependencies
const userService = new UserService(accountRepository, userRepository);
const userController = new UserController(userService, userValidator);

const router = Router();

router.post('/sign-up', userController.signUp);

router.post('/', userController.createUser);

router.get('/', auth, userController.getAllUsers);

router.get('/me', auth, userController.getCurrentUser);

router.get('/:id', auth, validateId, userController.getUser);

router.patch('/', auth, userController.updateUser);

router.delete('/:id', auth, validateId, userController.deleteUser);

export default router;
