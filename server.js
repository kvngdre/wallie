require('dotenv').config();
require('express-async-errors');

const app = require('express')();
const appMiddleware = require('./app/middleware');
const appRoutes = require('./app/routes');
const config = require('config');
const connectDB = require('./db/db-setup');
const debug = require('debug')('app:server');

connectDB();
appMiddleware(app);
appRoutes(app);

const port = config.get('server.port');
debug(process.env.NODE_ENV);
const server = app.listen(port, () => console.log(`Listening on port:[${port}]`));

module.exports = server;
