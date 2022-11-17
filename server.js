require('dotenv').config();

const app = require('express')();
const config = require('config');
const debug = require('debug')('app:server');

const port = config.get('server.port');
app.listen(port, () => debug(`Listening on port:[${port}]`));
