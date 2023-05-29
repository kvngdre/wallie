import { Router } from 'express';
import SessionController from './session.controller.js';

const router = Router();
const sessionController = new SessionController();

router.post('/login', sessionController.login);

// router.get('/access-token');

router.get('/logout', sessionController.login);

export default router;
