const authRouter = require('../routes/auth.routes');
const userRouter = require('../routes/user.routes');

module.exports = app => {
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
}