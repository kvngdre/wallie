const request = require('supertest');
const User = require('../../models/user.model');

let server;

describe('verifyToken middleware', () => {
    beforeEach(() => (server = require('../../server')));
    afterEach(() => {
        server.close();
    });

    let token;

    const exec = () => {
        return request(server)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);
    };

    beforeEach(() => {
        token = new User().generateAccessToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 401 if token issuer or audience does not match server issuer and audience', async () => {
        token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsImlhdCI6MTY2OTA0NTcwMCwiYXVkIjoiQVBJIiwiaXNzIjoiV0FMTElFRSJ9.PXWVvBTj7sbTLyklFhZqctDat38a1n1iDDbTOl52_iA';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 403 if token is invalid', async () => {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.';

        const res = await exec();

        expect(res.status).toBe(403);
    });

    it('should return 200 if token is invalid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});
