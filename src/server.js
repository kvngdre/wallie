import express from 'express';
import 'express-async-errors';
const config = require('./config');
const loaders = require('./loaders/index');

// Load app
loaders(app);

function startServer() {}

const appName = `${config.name}::${process.env.NODE_ENV}`;
const port = config.port || 4000;
const server = app.listen(port, () =>
  console.log(`${appName}- Listening on [${port}]`),
);

module.exports = server;
