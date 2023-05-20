import ForbiddenError from '../errors/forbidden.error.js';
import { UserRole } from '../utils/userRoles.utils.js';

module.exports = (req, res, next) => {
  const { role } = req.currentUser;
  if (role !== UserRole.ADMIN)
    throw new ForbiddenError('Access denied. Admin only.');

  next();
};
