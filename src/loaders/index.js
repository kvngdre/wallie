const errorHandler = require('../utils/errorHandler');
const dbLoader = require('./db.loader');
const expressLoader = require('./express.loader');

module.exports = (app) => {
    process.on('uncaughtException', (error) => {
        errorHandler.handleError(error);
        if (!errorHandler.isTrustedError(error)) {
            console.error('UncaughtException');
            process.exit(1);
        }
    });

    dbLoader();
    logger.info('DB loaded and connected ✔');

    expressLoader(app);
    logger.info('Express loaded ✔');
};
