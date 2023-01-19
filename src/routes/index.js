const accountRouter = require('./account.routes');
const authRouter = require('./auth.routes');
const transactionRouter = require('./transaction.routes');
const userRouter = require('./user.routes');
const Router = require('express').Router;

const router = Router();

module.exports = () => {
    router.use('/accounts', accountRouter);
    router.use('/auth', authRouter);
    router.use('/transactions', transactionRouter);
    router.use('/users', userRouter);

    return router;
};
