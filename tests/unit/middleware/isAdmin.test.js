const ForbiddenError = require('../../../src/errors/ForbiddenError');
const isAdmin = require('../../../src/middleware/isAdmin');
const roles = require('../../../src/utils/userRoles');

describe('isAdmin middleware', () => {
    it('grants access to resource if user role is admin.', () => {
        const req = {
            currentUser: { id: 1, role: roles.admin },
        };
        const res = {};
        const next = jest.fn();
        
        isAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('throws a ForbiddenError, if user role is not admin.', () => {
        const req = {
            currentUser: { id: 1, role: roles.user },
        };
        const res = {};
        const next = jest.fn();

        expect(() => isAdmin(req, res, next)).toThrow(ForbiddenError);
    });
});
