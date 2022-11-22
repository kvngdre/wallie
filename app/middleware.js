const compression = require('compression');
const express = require('express');
const helmet = require('helmet');

module.exports = app => {
    // parse JSON bodies (as sent by API clients)
    app.use(express.json());
    app.use(helmet());
    app.use(compression());
}