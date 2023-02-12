const accountRoutes = require('./account.routes');
const authRoutes = require('./auth.routes');
const transactionRoutes = require('./transaction.routes');
const userRoutes = require('./user.routes');
const Router = require('express').Router;

const router = Router();

module.exports = () => {
    router.use('/accounts', accountRoutes);
    router.use('/auth', authRoutes);
    router.use('/transactions', transactionRoutes);
    router.use('/users', userRoutes);

    return router;
};
