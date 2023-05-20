import Router from 'express';
import auth from '../middleware/auth.middleware.js';
import validateId from '../middleware/validateId.middleware.js';
import UserController from '../user/user.controller.js';

const router = Router();
const userController = new UserController();

router.post('/signup', userController.createUser);

router.get('/', auth, userController.getAllUsers);

router.get('/me', auth, userController.getCurrentUser);

router.get('/:id', auth, validateId, userController.getUser);

router.patch('/', auth, userController.updateUser);

router.delete('/:id', auth, validateId, userController.deleteUser);

export default router;
