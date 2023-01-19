const request = require('supertest');
const User = require('../../src/models/user.model');

let server;

describe('users', () => {
    beforeEach(() => (server = require('../../src/server')));
    afterEach(() => {
        server.close();
    });

    describe('GET /users', () => {
        let token;

        const exec = () => {
            return request(server)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`);
        };

        beforeEach(() => (token = new User().generateAccessToken()));

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return all users if client is logged in', async () => {
            const { body: users } = await exec();

            expect(users.data.length).toBe(4);
            expect(
                users.data.some((u) => u.first_name === 'Alice')
            ).toBeTruthy();
        });
    });

    describe('GET /users/:id', () => {
        let id;
        let token;

        const exec = () => {
            return request(server)
                .get(`/api/users/${id}`)
                .set('Authorization', `Bearer ${token}`);
        };

        beforeEach(async () => {
            id = (await User.query())[0].id;
            token = new User().generateAccessToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return a user if valid id is passed.', async () => {
            const { body: user } = await exec();

            expect(user.data.id).toBe(id);
            expect(user.data.first_name).toBe('Bojack');
        });

        it('should return 404 if invalid id is passed', async () => {
            id = 0;

            const res = await exec();

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /users/new', () => {
        let email;
        let password;

        const exec = () => {
            return request(server).post('/api/users/new').send({
                first_name: 'Yin',
                last_name: 'Yang',
                email,
                password,
            });
        };

        it('should create a new user if input is valid', async () => {
            email = 'ying@yang.com';
            password = 'Password2@';

            const { body: newUser } = await exec();

            const foundUser = await User.query().findOne({ first_name: 'Yin' });

            expect(foundUser).not.toBeNull();
            expect(newUser.data).toHaveProperty('id');
            expect(newUser.data.first_name).toBe('Yin');
        });

        it('should return 409 if user already exists', async () => {
            email = 'ying@yang.com';
            password = 'Password2@';

            const res = await exec();

            expect(res.status).toBe(409);
        });

        it('should return 400 if email is not valid', async () => {
            email = 'yang.com';

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('must be a valid');
        });

        it('should return 400 if password does not contain a number or special character', async () => {
            password = 'Password';

            const res = await exec();

            expect(res.status).toBe(400);
        });
    });

    describe('PATCH /users/:id', () => {
        let id;
        let token;
        let payload = { first_name: 'Jack' };

        const exec = () => {
            return request(server)
                .patch(`/api/users/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(payload);
        };

        beforeEach(async () => {
            const users = await User.query();
            id = users[users.length - 1].id;
            token = new User().generateAccessToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if invalid id is passed', async () => {
            id = 0;

            const res = await exec();

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('should update and return user if input is valid', async () => {
            const res = await exec();

            const foundUser = await User.query().findOne({ first_name: 'Jack' });

            expect(res.status).toBe(200);
            expect(foundUser).not.toBeNull();
            expect(res.body.data.first_name).toBe('Jack');
        });

        it('should return 400 if input contains email or password', async () => {
            payload.email = 'user@email.com';

            const res = await exec();

            expect(res.status).toBe(400);
        });
    });

    describe('DELETE /user/:id', () => {
        let id;
        let token;

        const exec = () => {
            return request(server)
                .delete(`/api/users/${id}`)
                .set('Authorization', `Bearer ${token}`);
        };

        beforeEach(async () => {
            const users = await User.query();
            id = users[users.length - 1].id;
            token = new User().generateAccessToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if invalid id is passed', async () => {
            id = 0;

            const res = await exec();

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('should delete the user record and return 204 if valid id is passed', async () => {
            const res = await exec();

            expect(res.status).toBe(204);
        });
    });
});
