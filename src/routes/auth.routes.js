import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', AuthController.login);

router.post('/logout', AuthController.login);

export default router;
