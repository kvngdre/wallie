const request = require('supertest');
const roles = require('../../src/utils/userRoles');
const User = require('../../src/models/user.model');

let server;

describe('users', () => {
    beforeEach(() => (server = require('../../src/server')));
    afterEach(() => {
        server.close();
    });

    describe('POST - create new user - /users/new', () => {
        let email = 'jack@email.com';
        let password = 'Password1!';

        const exec = () => {
            return request(server).post('/api/users/new').send({
                first_name: 'Jack',
                last_name: 'Sparrow',
                email,
                password,
            });
        };

        it('returns status code 201, if input is valid', async () => {
            const response = await exec();
            const foundUser = await User.query().findOne({ email });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data).toHaveProperty('id');
            expect(foundUser).not.toBeNull();
            expect(response.body.body.data.id).toBe(foundUser.id);
            expect(response.body.body.data.first_name).toBe('Jack');
        });

        it('returns status code 409, if email already exists in db', async () => {
            password = 'Password2@';

            const response = await exec();

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns 400 if payload does not pass validation', async () => {
            email = 'jack@.com';

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET - get all users - /users', () => {
        let token;

        const exec = () => {
            return request(server)
                .get('/api/users')
                .set('authorization', `Bearer ${token}`);
        };

        it('returns status code 401 if client is not signed in', async () => {
            token = '';

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 403 if client role is not admin', async () => {
            token = User.fromJson({
                first_name: 'abc',
                last_name: 'def',
                email: 'abc@email.com',
                password: 'password',
                role: roles.user,
            }).generateAccessToken();

            const response = await exec();

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns all users if client role is admin', async () => {
            token = User.fromJson({
                first_name: 'abc',
                last_name: 'def',
                email: 'abc@email.com',
                password: 'password',
                role: roles.admin,
            }).generateAccessToken();

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.body.data.length).toBe(5);
            expect(
                response.body.body.data.some(
                    (user) => user.first_name === 'Jack'
                )
            ).toBeTruthy();
        });
    });

    describe('GET - get current user - /users/me', () => {
        let id = 1;
        let token;

        const exec = () => {
            return request(server)
                .get('/api/users/me')
                .set('authorization', `Bearer ${token}`);
        };

        beforeEach(async () => {
            const foundUser = await User.query().findById(id);
            token = foundUser.generateAccessToken();
        });

        it('returns status code 401 if client is not signed in', async () => {
            token = '';

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 if client is signed in.', async () => {
            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data.id).toBe(id);
        });
    });

    describe('GET - get a user - /users/:id', () => {
        let id;
        let token;

        const exec = () => {
            return request(server)
                .get(`/api/users/${id}`)
                .set('authorization', `Bearer ${token}`);
        };

        beforeEach(() => {
            token = token = User.fromJson({
                first_name: 'abc',
                last_name: 'def',
                email: 'abc@email.com',
                password: 'password',
                role: roles.admin,
            }).generateAccessToken();
        });

        it('returns status code 401 if client is not signed in', async () => {
            token = '';

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 400 if client passes an invalid id.', async () => {
            id = 1.1;

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 403 if client role is not admin', async () => {
            id = 2;
            token = User.fromJson({
                first_name: 'abc',
                last_name: 'def',
                email: 'abc@email.com',
                password: 'password',
                role: roles.user,
            }).generateAccessToken();

            const response = await exec();

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 404 if user id is not found', async () => {
            id = 100;

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 if user id is valid and found.', async () => {
            id = 1;
            const response = await exec();

            const foundUser = await User.query().findById(id);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data.id).toBe(id);
            expect(foundUser).not.toBeNull();
            expect(response.body.body.data.first_name).toBe(
                foundUser.first_name
            );
        });
    });

    describe('PATCH - update a user - /users/', () => {
        let id = 5;
        let token;
        let payload = { first_name: 'Jon', last_name: 'Snow' };

        const exec = () => {
            return request(server)
                .patch(`/api/users/`)
                .set('Authorization', `Bearer ${token}`)
                .send(payload);
        };

        beforeEach(async () => {
            const foundUser = await User.query().findById(id);
            token = foundUser.generateAccessToken();
        });

        it('returns status code 401 if client is not signed in', async () => {
            token = '';

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status 200 if input is valid and user updated', async () => {
            const response = await exec();
            const foundUser = await User.query().findById(id);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(foundUser).not.toBeNull();
            expect(response.body.body.data).toMatchObject(payload);
        });

        it('returns status code 400 if payload does not pass validation.', async () => {
            payload = { first_name: 1 };

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 400 if input contains email or password', async () => {
            payload.email = 'user@email.com';

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('DELETE - delete a user - /users/:id', () => {
        let id;
        let currentUserId;
        let role;
        let token;

        const exec = () => {
            return request(server)
                .delete(`/api/users/${id}`)
                .set('Authorization', `Bearer ${token}`);
        };

        const setToken = () => {
            token = User.fromJson({
                id: currentUserId,
                first_name: 'abc',
                last_name: 'xyz',
                email: 'abc@email.com',
                password: 'password',
                role,
            }).generateAccessToken();
        };

        it('returns status code 401 if client is not signed in', async () => {
            token = '';

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 400 if client passes an invalid id.', async () => {
            id = 1.1;
            currentUserId = 1;
            role = roles.admin;
            setToken();

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 403 if client role is not admin', async () => {
            id = 2;
            currentUserId = 5;
            role = roles.user;
            setToken();

            const response = await exec();

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 404 if user id is not found', async () => {
            id = 100;
            currentUserId = 1;
            role = roles.admin;
            setToken();

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 409 if admin user attempts delete themselves when other users exist.', async () => {
            id = 1;
            currentUserId = 1;
            role = roles.admin;
            setToken();

            const response = await exec();

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 if user id is valid and deleted.', async () => {
            id = 5;
            currentUserId = 1;
            role = roles.admin;
            setToken();

            const response = await exec();
            const foundUser = await User.query().findById(id);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(foundUser).toBeUndefined();
        });
    });
});
