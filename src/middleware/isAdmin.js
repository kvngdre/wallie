const ForbiddenException = require('../errors/ForbiddenError');
const roles = require('../utils/userRoles');

module.exports = (req, res, next) => {
    const { role } = req.currentUser;
    if (role !== roles.admin)
        throw new ForbiddenException('Access denied. Admin only.');

    next();
};
