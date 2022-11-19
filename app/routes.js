const accountRouter = require('../routes/account.routes');
const authRouter = require('../routes/auth.routes');
const transactionRouter = require('../routes/transaction.routes');
const userRouter = require('../routes/user.routes');

module.exports = (app) => {
    app.use('/accounts', accountRouter);
    app.use('/auth', authRouter);
    app.use('/transactions', transactionRouter);
    app.use('/users', userRouter);
};
