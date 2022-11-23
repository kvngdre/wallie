const request = require('supertest');

let server;

describe('auth', () => {
    beforeEach(() => (server = require('../../server')));
    afterEach(() => {
        server.close();
    });

    describe('POST /api/auth/login', () => {
        let email;
        let password;
        const exec = () => {
            return request(server)
                .post('/api/auth/login')
                .send({ email, password });
        };

        it('should return 401 if input is invalid', async () => {
            email = 'bojack@example.com';
            password = 'P@ssw1rd';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 200 and access token, if input is valid.', async () => {
            email = 'bojack@example.com';
            password = 'Password1!';

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('token');
        });
    });
});
