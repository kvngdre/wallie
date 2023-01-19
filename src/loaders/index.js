const dbLoader = require('./db.loader');
const expressLoader = require('./express.loader');
const logger = require('../utils/logger')('index.loader.js');

module.exports = (app) => {
    dbLoader()
    logger.info('DB loaded and connected');

    expressLoader(app)
    logger.info('Express loaded'); 
}