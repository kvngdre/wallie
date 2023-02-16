// require('dotenv').config();
require('express-async-errors');
process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';

const app = require('express')();
const config = require('./config/config');
const loaders = require('./loaders/index');

// Load app
loaders(app);

const appName = `${config.name}::${process.env.NODE_ENV}`;
const port = config.port || 4000;
const server = app.listen(port, () =>
    console.log(`${appName}- Listening on [${port}]`)
);

module.exports = server;
