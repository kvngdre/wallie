const { httpStatusCodes } = require('../utils/constants');
const APIError = require('../errors/APIError');
const roles = require('../utils/userRoles');

module.exports = (req, res, next) => {
    const { currentUser, params } = req;

    if (
        isNaN(params.id) ||
        params.id < 1 ||
        !Number.isInteger(Number(params.id))
    )
        throw new APIError(httpStatusCodes.BAD_REQUEST, true, 'Invalid id');

    next();
};
