import { Router } from 'express';
import AccountRepository from '../account/account.repository.js';
import validateId from '../middleware/validateId.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import UserController from '../user/user.controller.js';
import JwtService from '../utils/jwt-service.utils.js';
import UserRepository from './user.repository.js';
import UserService from './user.service.js';
import UserValidator from './user.validator.js';

// Creating dependency instances
const userValidator = new UserValidator();
const userRepository = new UserRepository();
const accountRepository = new AccountRepository();
const jwtService = new JwtService();

// Injecting dependencies
const userService = new UserService(
  accountRepository,
  userRepository,
  jwtService,
);
const userController = new UserController(userService, userValidator);

const router = Router();

router.post('/sign-up', userController.signUp);

router.post('/', verifyToken, userController.createUser);

router.get('/', verifyToken, userController.getUsers);

router.get('/me', verifyToken, userController.getCurrentUser);

router.get('/verification/resend', userController.resendVerificationUrl);

router.get('/verify/:userId/:token', userController.verify);

router.get('/:userId', verifyToken, validateId, userController.getUser);

router.patch('/:userId', verifyToken, validateId, userController.updateUser);

router.put(
  '/:userId/password',
  verifyToken,
  validateId,
  userController.updatePassword,
);

router.delete('/:userId', verifyToken, validateId, userController.deleteUser);

export default router;
