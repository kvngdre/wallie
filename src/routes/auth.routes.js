const AuthController = require('../controllers/auth.controller');
const Router = require('express').Router;

const router = Router();

router.post('/sign-in', AuthController.login);

module.exports = router;
