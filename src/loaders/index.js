const dbLoader = require('./db.loader');
const errorHandler = require('../errors/errorHandler');
const expressLoader = require('./express.loader');
const logger = require('./logger');

module.exports = (app) => {
    process.on('uncaughtException', (error) => {
        errorHandler.handleError(error);
        if (!errorHandler.isTrustedError(error)) {
            console.log(error.message)
            console.error('UncaughtException');
            process.exit(1);
        }
    });

    dbLoader();
    logger.info('DB loaded and connected ✔');

    expressLoader(app);
    logger.info('Express loaded 🚀');
};
