const { httpStatusCodes } = require('../utils/constants');
const errorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    errorHandler.handleError(err);

    if (errorHandler.isTrustedError(err)) {
        return res.status(err.code).json({
            success: false,
            errors: {
                name: err.name,
                message: err.message,
            },
        });
    }

    res.status(httpStatusCodes.INTERNAL_SERVER).json({
        success: false,
        errors: {
            name: 'Error',
            message: 'Something went wrong',
        },
    });
};
