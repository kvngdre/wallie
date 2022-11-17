const express = require('express');

module.exports = app => {
    // parse JSON bodies (as sent by API clients)
    app.use(express.json());
}