import { Router } from 'express';
import AuthController from './auth.controller.js';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);

router.post('/logout', authController.login);

export default router;
