const User = require('../../../models/user.model');
const verifyToken = require('../../../middleware/verifyToken');

describe('verifyToken middleware', () => {
    it('should populate req.user with payload of valid JWT', () => {
        const user = {id: 1, firstName: 'Yin', lastName: 'Yan', email: 'yin@yan.com', password: 'pwd' };
        const token = User.fromJson(user).generateAccessToken();
        
        const req = { header: jest.fn().mockReturnValue(`Bearer ${token}`) };
        const res = { sendStatus: jest.fn().mockReturnValue(403) };
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(req.user).toHaveProperty('id', 1);
    });
});
