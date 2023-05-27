import { Router } from 'express';
import AccountRepository from '../account/account.repository.js';
import auth from '../middleware/auth.middleware.js';
import validateId from '../middleware/validateId.middleware.js';
import UserController from '../user/user.controller.js';
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

router.get('/', userController.getUsers);

router.get('/me', auth, userController.getCurrentUser);

router.get('/:userId', validateId, userController.getUser);

router.patch('/:userId', validateId, userController.updateUser);

router.delete('/:userId', validateId, userController.deleteUser);

export default router;
