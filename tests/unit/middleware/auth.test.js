const auth = require('../../../src/middleware/auth');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../../src/errors/UnauthorizedError');
const User = require('../../../src/models/user.model');

describe('auth middleware', () => {
    it('should populate req.currentUser with decoded payload if jwt is valid', () => {
        const token = User.fromJson({
            id: 1,
            first_name: 'abc',
            last_name: 'def',
            email: 'abc@email.com',
            password: 'pass',
            role: 'W2',
        }).generateAccessToken();

        const req = {
            headers: { authorization: `Bearer ${token}` },
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.currentUser).toBeDefined();
        expect(req.currentUser).toMatchObject({ id: 1, role: 'W2' });
    });

    it('throws an UnauthorizedError if JWT claim issuer and/or audience does not match decode payload.', () => {
        const token = jwt.sign({ id: 1, role: 'W2' }, 'secretKey', {
            audience: 'api',
            issuer: 'myAPI',
        });

        const req = {
            headers: { authorization: `Bearer ${token}` },
        };
        const res = {};
        const next = jest.fn();

        expect(() => auth(req, res, next)).toThrow(UnauthorizedError);
    });

    it.each([[{ headers: {} }], [{ headers: { authorization: `Bearer ` } }]])(
        'throws an UnauthorizedError if no token is provided.',
        (val) => {
            const req = val;
            const res = {};
            const next = jest.fn();

            expect(() => {
                auth(req, res, next);
            }).toThrow(UnauthorizedError);
        }
    );
});
