const config = require('../config/config');
const cors = require('cors');
const errorMiddleware = require('../middleware/error');
const express = require('express');
const helmet = require('helmet');
const NotFoundError = require('../errors/NotFoundError');
const routes = require('../routes/index');

module.exports = (app) => {
    /**
     * Health check endpoints
     *
     * These are useful to quickly check if api is up and debugging.
     */
    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(helmet());

    /**
     * The magic package that prevents frontend developers going nuts\
     * Alternate description:
     * Enable Cross Origin Resource Sharing to all origins by default
     */
    app.use(cors());

    // Parse JSON bodies (as sent by API clients)
    app.use(express.json());

    // Load API routes
    app.use(config.api.prefix, routes());

    // Catch and handle 404
    app.use((req, res, next) => {
        const err = new NotFoundError('Resource not found');
        next(err);
    });

    // Error handling middleware
    app.use(errorMiddleware);
};
