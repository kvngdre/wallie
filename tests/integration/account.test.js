const request = require('supertest');
const roles = require('../../src/utils/userRoles');
const Account = require('../../src/models/account.model');
const User = require('../../src/models/user.model');

let server;

describe('accounts', () => {
    beforeEach(() => (server = require('../../src/server')));
    afterEach(() => {
        server.close();
    });

    describe('POST - create new account - /api/accounts/new', () => {
        let id = 4;
        let pin;
        let token;

        const exec = () => {
            return request(server)
                .post('/api/accounts/new')
                .set('authorization', `Bearer ${token}`)
                .send({ pin });
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

        it('returns 400 if pin is not a four digit number string', async () => {
            pin = 123;

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 201, if input is valid', async () => {
            pin = '0000';

            const response = await exec();
            const foundAccount = await Account.query().findOne({ user_id: id });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data).toHaveProperty('id');
            expect(foundAccount).not.toBeNull();
            expect(response.body.body.data.id).toBe(foundAccount.id);
            expect(response.body.body.data.balance).toBe('0.00');
        });
    });

    describe('GET - get all accounts - /api/accounts', () => {
        let token;

        const exec = () => {
            return request(server)
                .get('/api/accounts')
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

        it('returns all accounts if client role is admin', async () => {
            token = User.fromJson({
                first_name: 'abc',
                last_name: 'def',
                email: 'abc@email.com',
                password: 'password',
                role: roles.admin,
            }).generateAccessToken();

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.body.data.length).toBe(4);
            expect(
                response.body.body.data.some((account) => (account.user_id = 4))
            ).toBeTruthy();
        });
    });

    describe('GET - get current user account - /api/accounts/me', () => {
        let id = 4;
        let token;

        const exec = () => {
            return request(server)
                .get('/api/accounts/me')
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
            expect(response.body.body.data.user_id).toBe(id);
        });
    });

    describe('GET - get an account - /api/accounts/:id', () => {
        let id;
        let token;

        const exec = () => {
            return request(server)
                .get(`/api/accounts/${id}`)
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
            id = 4;
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

        it('returns status code 404 if account id is not found', async () => {
            id = 100;

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 if account id is valid and found.', async () => {
            id = 4;
            const response = await exec();
            const foundAccount = await Account.query().findById(id);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data.id).toBe(id);
            expect(foundAccount).not.toBeNull();
            expect(response.body.body.data.balance).toBe('0.00');
        });
    });

    // describe('PATCH - update an account - /api/accounts/:id', () => {
    //     let id;
    //     let token;
    //     let amount;
    //     let payload = { balance: Number(amount) };

    //     const exec = () => {
    //         return request(server)
    //             .get(`/api/accounts/${id}`)
    //             .set('authorization', `Bearer ${token}`)
    //             .send(payload);
    //     };

    //     beforeEach(() => {
    //         token = token = User.fromJson({
    //             first_name: 'abc',
    //             last_name: 'def',
    //             email: 'abc@email.com',
    //             password: 'password',
    //             role: roles.admin,
    //         }).generateAccessToken();
    //     });

    //     it('returns status code 401 if client is not signed in', async () => {
    //         token = '';

    //         const response = await exec();

    //         expect(response.status).toBe(401);
    //         expect(response.body.success).toBe(false);
    //         expect(response.body).toHaveProperty('errors');
    //     });

    //     it('returns status code 404 if account id is not found', async () => {
    //         id = 100;

    //         const response = await exec();

    //         expect(response.status).toBe(404);
    //         expect(response.body.success).toBe(false);
    //         expect(response.body).toHaveProperty('errors');
    //     });

    //     it('returns status code 200 if account id is valid and found.', async () => {
    //         id = 4;

    //         const response = await exec();
    //         const foundAccount = await Account.query().findById(id);

    //         expect(response.status).toBe(200);
    //         expect(response.body.success).toBe(true);
    //         expect(response.body.body.data.id).toBe(id);
    //         expect(response.body.body.data.balance).toBe('0.00');
    //     });
    // });

    describe('GET - get account balance - /api/accounts/balance', () => {
        let id = 4;
        let token;

        const exec = () => {
            return request(server)
                .get(`/api/accounts/balance`)
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
            expect(response.body.body.data).toHaveProperty('balance');
        });
    });

    describe('POST - credit account - /api/accounts/fund', () => {
        let currentUserId;
        let token;
        let role = roles.user;
        let payload = { desc: 'Chop life crew' };

        const exec = () => {
            return request(server)
                .post(`/api/accounts/fund/`)
                .set('authorization', `Bearer ${token}`)
                .send(payload);
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

        it('returns status code 400 if input amount is not a positive number', async () => {
            currentUserId = 4;
            payload.amount = 0;
            setToken();

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 404 if account id is not found', async () => {
            currentUserId = 100;
            payload.amount = 100.56;
            setToken();

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 if client is signed in.', async () => {
            currentUserId = 4;
            payload.amount = 100.56;
            setToken();

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data.balance).toBe(100.56);
        });
    });

    describe('POST - debit account - /api/accounts/debit', () => {
        let currentUserId;
        let token;
        let payload = { desc: 'Chop life crew', pin: '0000' };

        const exec = () => {
            return request(server)
                .post(`/api/accounts/debit`)
                .set('authorization', `Bearer ${token}`)
                .send(payload);
        };

        const setToken = () => {
            token = User.fromJson({
                id: currentUserId,
                first_name: 'abc',
                last_name: 'xyz',
                email: 'abc@email.com',
                password: 'password',
                role: roles.user,
            }).generateAccessToken();
        };

        it('returns status code 401 if client is not signed in', async () => {
            token = '';

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 400 if input amount is not a positive number', async () => {
            currentUserId = 4;
            payload.amount = 0;
            setToken();

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 400 if pin is not a provided', async () => {
            currentUserId = 4;
            payload.amount = 10;
            payload.pin = '';
            setToken();

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 401 if pin is incorrect', async () => {
            currentUserId = 4;
            payload.amount = 10;
            payload.pin = '1111';
            setToken();

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 404 if account id is not found', async () => {
            currentUserId = 100;
            setToken();

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 402 if account id is not found', async () => {
            currentUserId = 4;
            payload.amount = 10_000_000;
            payload.pin = '0000';
            setToken();

            const response = await exec();

            expect(response.status).toBe(402);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 if client is signed in.', async () => {
            currentUserId = 4;
            payload.amount = 10.56;
            payload.pin = '0000';
            setToken();

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data.balance).toBe(90);
        });
    });

    describe('POST - transfer funds to another account - /api/accounts/transfer-funds', () => {
        let currentUserId;
        let token;
        let payload = {
            amount: '',
            dest_id: '',
            desc: 'Chop life crew',
            pin: '0000',
        };

        const exec = () => {
            return request(server)
                .post(`/api/accounts/transfer-funds`)
                .set('authorization', `Bearer ${token}`)
                .send(payload);
        };

        const setToken = () => {
            token = User.fromJson({
                id: currentUserId,
                first_name: 'abc',
                last_name: 'xyz',
                email: 'abc@email.com',
                password: 'password',
                role: roles.user,
            }).generateAccessToken();
        };

        it('returns status code 401 if client is not signed in', async () => {
            currentUserId = 4;
            token = '';

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 400 if input amount is not a positive number', async () => {
            currentUserId = 4;
            payload.amount = 0;
            payload.dest_id = 1;
            setToken();

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 400 if pin is not a provided', async () => {
            currentUserId = 4;
            payload.amount = 10;
            payload.pin = '';
            payload.dest_id = 1;
            setToken();

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 401 if pin is incorrect', async () => {
            currentUserId = 4;
            payload.amount = 10;
            payload.pin = '1111';
            payload.dest_id = 1;
            setToken();

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 404 if account id is not found', async () => {
            currentUserId = 4;
            payload.pin = '0000';
            payload.dest_id = 100;
            setToken();

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 if client is signed in.', async () => {
            currentUserId = 4;
            payload.amount = 10;
            payload.dest_id = 1;
            setToken();

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data.balance).toBe(80);
        });
    });

    describe('DELETE - deleted an account - /api/accounts/:id', () => {
        let id;
        let token;
        let currentUserId = 1;
        let role = roles.admin;

        const exec = () => {
            return request(server)
                .delete(`/api/accounts/${id}`)
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
            setToken();

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 403 if client role is not admin', async () => {
            id = 4;
            role = roles.user;
            setToken();

            const response = await exec();

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 404 if user id is not found', async () => {
            id = 100;
            role = roles.admin;
            setToken();

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 if user id is valid and deleted.', async () => {
            id = 4;
            setToken();

            const response = await exec();
            const foundAccount = await Account.query().findById(id);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(foundAccount).toBeUndefined();
        });
    });
});
