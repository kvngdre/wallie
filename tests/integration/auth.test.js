const request = require('supertest');
const roles = require('../../src/utils/userRoles');
const User = require('../../src/models/user.model');

let server;

describe('authentication', () => {
    beforeEach(() => (server = require('../../src/server')));
    afterEach(() => {
        server.close();
    });

    describe('POST - sign in user - /api/auth/sign-in', () => {
        let payload = { email: 'bojack@email.com', password: 'Password1!' };

        const exec = () => {
            return request(server).post('/api/auth/sign-in').send(payload);
        };

        it('returns 400 if input does not pass validation', async () => {
            payload.email = 'an email';

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 401, if password is incorrect', async () => {
            payload.email = 'bojack@email.com';
            payload.password = '0000';

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 404, if user email is not found', async () => {
            payload.email = 'b@email.com';

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 and access token, if user email and password match', async () => {
            payload = { email: 'bojack@email.com', password: 'Password1!' };

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body).not.toHaveProperty('errors');
            expect(response.body.body.data).toHaveProperty('token');
        });
    });
});
