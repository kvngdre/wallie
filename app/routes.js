const accountRouter = require('../routes/account.routes');
const authRouter = require('../routes/auth.routes');
const errorHandler = require('../middleware/errorHandler');
const transactionRouter = require('../routes/transaction.routes');
const userRouter = require('../routes/user.routes');

module.exports = (app) => {
    app.use('/api/accounts', accountRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/transactions', transactionRouter);
    app.use('/api/users', userRouter);
    app.use(errorHandler);
};
