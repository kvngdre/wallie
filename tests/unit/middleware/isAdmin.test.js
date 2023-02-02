const roles = require('../../../src/utils/userRoles');
const isAdmin = require('../../../src/middleware/isAdmin');
const APIError = require('../../../src/errors/APIError');

describe('isAdmin middleware', () => {
    it('should grant access to resource if user is admin', () => {
        const req = {
            currentUser: { id: 1, role: roles.admin },
        };
        const res = {};
        const next = jest.fn();
        
        isAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should throw an APIError, if not an admin user', () => {
        const req = {
            currentUser: { id: 1, role: roles.user },
        };
        const res = {};
        const next = jest.fn();

        expect(() => isAdmin(req, res, next)).toThrow(APIError);
    });
});
