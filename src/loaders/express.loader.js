const cors = require('cors');
const debug = require('debug')('app:expressLoader');
const express = require('express');
const routes = require('../routes/index');
const logger = require('../utils/logger')('express.loader.js');

module.exports = (app) => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());

    // Parse JSON bodies (as sent by API clients)
    app.use(express.json());
    // Load API routes
    app.use('/api', routes());

    // Catch and handle 404
    app.use((req, res, next) => {
        res.status(404).json({
            message: 'Not Found',
        });
        next();
    });

    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && 'body' in err) {
            debug(err.message);
            return res.status(400).json({
                success: false,
                message: 'Error in JSON object.',
            });
        }

        debug(err);
        logger.error({
            method: 'global_error_handler',
            message: err.message,
            stack: err.stack
        })
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });

        next();
    });
};
