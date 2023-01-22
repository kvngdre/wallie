const dbLoader = require('./db.loader');
const expressLoader = require('./express.loader');
const logger = require('../utils/logger');

module.exports = (app) => {
    dbLoader()
    logger.info({message: 'DB loaded and connected'});

    expressLoader(app)
    logger.info({message: 'Express loaded'}); 
}