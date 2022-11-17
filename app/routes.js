const userRouter = require('../routes/user.routes');

module.exports = app => {
    app.use('/users', userRouter);
}