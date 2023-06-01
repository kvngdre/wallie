import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.middleware.js';
import UserRepository from '../user/user.repository.js';
import JwtService from '../utils/jwt-service.utils.js';
import SessionController from './session.controller.js';
import SessionRepository from './session.repository.js';
import SessionService from './session.service.js';
import SessionValidator from './session.validator.js';

// * Creating dependency instances
const jwtService = new JwtService();
const sessionRepository = new SessionRepository();
const sessionValidator = new SessionValidator();
const userRepository = new UserRepository();

// * Injecting dependencies
const sessionService = new SessionService(
  jwtService,
  sessionRepository,
  userRepository,
);
const sessionController = new SessionController(
  sessionService,
  sessionValidator,
);

const router = Router();

router.post('/login', sessionController.login);

// router.get('/access-token');

router.get('/logout', verifyToken, sessionController.logout);

export default router;
