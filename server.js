require('dotenv').config();
require('express-async-errors');

const app = require('express')();
const appMiddleware = require('./app/middleware');
const appRoutes = require('./app/routes');
const connectDB = require('./db/db-setup');

connectDB();
appMiddleware(app);
appRoutes(app);

const port = process.env.PORT || 4000;
console.log(process.env.NODE_ENV);
const server = app.listen(port, () => console.log(`Listening on port:[${port}]`));

module.exports = server;
