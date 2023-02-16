const APIError = require('../errors/APIError');
const { httpStatusCodes } = require('../utils/constants');
const roles = require('../utils/userRoles');

module.exports = (req, res, next) => {
    const { role } = req.currentUser;
    if (role !== roles.admin)
        throw new APIError(httpStatusCodes.FORBIDDEN, true, 'Access denied. Admin only.');

    next();
};
