import Router from 'express';
import auth from '../middleware/auth.middleware.js';
import validateId from '../middleware/validateId.middleware.js';
import UserController from '../user/user.controller.js';

const router = Router();
const userController = new UserController();

router.post('/signup', UserController.createUser);

router.get('/', auth, UserController.getAllUsers);

router.get('/me', auth, UserController.getCurrentUser);

router.get('/:id', auth, validateId, UserController.getUser);

router.patch('/', auth, UserController.updateUser);

router.delete('/:id', auth, validateId, UserController.deleteUser);

export default router;
