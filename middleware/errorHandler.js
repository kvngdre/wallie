const debug = require('debug')('app:errorHandler');

module.exports = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        debug(err.message);
        return res.status(400).send('Error in JSON object.');
    }

    debug(err);
    res.status(500).send('Internal Server Error');

    next();
};
