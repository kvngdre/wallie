require('dotenv').config();

const app = require('express')();
const config = require('config');
const connectDB = require('./db/db-setup');
const debug = require('debug')('app:server');
const appMiddleware = require('./app/middleware');
const appRoutes = require('./app/routes');

connectDB();
appMiddleware(app);
appRoutes(app);

const port = config.get('server.port');
app.listen(port, () => debug(`Listening on port:[${port}]`));
