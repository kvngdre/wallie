require('dotenv').config();

const app = require('express')();
const config = require('config');
const connectDB = require('./db/db-setup');
const debug = require('debug')('app:server');

connectDB();

const port = config.get('server.port');
app.listen(port, () => debug(`Listening on port:[${port}]`));
