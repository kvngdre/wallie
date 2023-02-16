const { txnPurposes, txnTypes } = require('../../src/utils/constants');
const request = require('supertest');
const roles = require('../../src/utils/userRoles');
const Transaction = require('../../src/models/transaction.model');
const User = require('../../src/models/user.model');

let server;

describe('transactions', () => {
    beforeEach(() => (server = require('../../src/server')));
    afterEach(() => {
        server.close();
    });

    describe('POST - create new transaction - /transactions/new', () => {
        let currentUserId;
        let role = roles.admin;
        let token;
        let payload = {
            account_id: 1,
            type: txnTypes.CREDIT,
            purpose: txnPurposes.DEPOSIT,
            amount: Number(100),
            description: 'small funds',
            bal_before: Number(110),
            bal_after: 210,
        };

        const exec = () => {
            return request(server)
                .post('/api/v1/transactions/new')
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

        it('returns 400 if payload does not pass validation', async () => {
            currentUserId = 1;
            payload.purpose = 'balling';
            setToken();

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns 403 if client user role is not admin', async () => {
            currentUserId = 1;
            payload.purpose = txnPurposes.DEPOSIT;
            role = roles.user;
            setToken();

            const response = await exec();

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns 404 if account id not found.', async () => {
            payload.account_id = 4;
            currentUserId = 1;
            role = roles.admin;
            setToken();

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 201, if input is valid', async () => {
            payload.account_id = 1;
            currentUserId = 1;
            role = roles.admin;
            setToken();

            const response = await exec();
            const foundUser = await Transaction.query().findOne({
                account_id: payload.account_id,
            });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data).toHaveProperty('id');
            expect(foundUser).not.toBeNull();
            expect(response.body.body.data.bal_before).toBe(110);
        });
    });

    describe('GET - get all transactions - /transactions', () => {
        let token;

        const exec = () => {
            return request(server)
                .get('/api/v1/transactions')
                .set('authorization', `Bearer ${token}`);
        };

        it('returns status code 401 if client is not signed in', async () => {
            token = '';

            const response = await exec();

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns all transactions if client role is signed in', async () => {
            token = User.fromJson({
                id: 1,
                first_name: 'abc',
                last_name: 'def',
                email: 'abc@email.com',
                password: 'password',
                role: roles.user,
            }).generateAccessToken();

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.body.data.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET - get a transaction - /transactions/:id', () => {
        let id = 1;
        let currentUserId = 1;
        let role = roles.admin;
        let token;

        const exec = () => {
            return request(server)
                .get(`/api/v1/transactions/${id}`)
                .set('authorization', `Bearer ${token}`);
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

        it('returns status code 404 if transaction cannot be found.', async () => {
            id = 5;
            currentUserId = 2;
            setToken();

            const response = await exec();

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 200 if client is signed in.', async () => {
            id = 1;
            currentUserId = 1;
            setToken();

            const response = await exec();

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.body.data.id).toBe(id);
            expect(response.body.body.data.amount).toBe('100.00');
        });
    });

    describe('PATCH - update a transaction - /transactions/:id', () => {
        let id = 1;
        let currentUserId = 1;
        let role = roles.admin;
        let token;
        let payload = { description: '' };

        const exec = () => {
            return request(server)
                .patch(`/api/v1/transactions/${id}`)
                .set('Authorization', `Bearer ${token}`)
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

        it('returns status code 403 if client role is not admin.', async () => {
            id = 4;
            currentUserId = 1;
            role = roles.user;
            setToken();

            const response = await exec();

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status code 400 if payload does not pass validation.', async () => {
            payload.type = txnTypes.DEBIT;
            role = roles.admin;
            setToken();

            const response = await exec();

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('errors');
        });

        it('returns status 200 if input is valid and user updated', async () => {
            id = 1;
            currentUserId = 1;
            payload = { description: 'Changed the desc' };
            setToken();

            const response = await exec();
            const foundUser = await Transaction.query().findById(id);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(foundUser).not.toBeNull();
            expect(response.body.body.data).toMatchObject(payload);
        });
    });

    describe('DELETE - delete a transaction - /transactions/:id', () => {
        let id;
        let currentUserId;
        let role = roles.admin;
        let token;

        const exec = () => {
            return request(server)
                .delete(`/api/v1/transactions/${id}`)
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
            currentUserId = 2;
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

        it('returns status code 200 if user id is valid and deleted.', async () => {
            id = 3;
            currentUserId = 1;
            role = roles.admin;
            setToken();

            const response = await exec();
            const foundUser = await Transaction.query().findById(id);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(foundUser).toBeUndefined();
        });
    });
});
