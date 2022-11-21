const Account = require('../../models/account.model');
const request = require('supertest');
const User = require('../../models/user.model');

let server;

describe('accounts', () => {
    beforeEach(() => (server = require('../../server')));
    afterEach(() => {
        server.close();
    });

    describe('GET /accounts', () => {
        let token;

        const exec = () => {
            return request(server)
                .get('/api/accounts')
                .set('Authorization', `Bearer ${token}`);
        };

        beforeEach(() => (token = new User().generateAccessToken()));

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return all accounts if client is logged in', async () => {
            const { body: accounts } = await exec();

            expect(accounts.data.length).toBe(3);
            expect(accounts.data.some((a) => a.userId === 1)).toBeTruthy();
        });
    });

    describe('GET /accounts/:id', () => {
        let id;
        let token;

        const exec = () => {
            return request(server)
                .get(`/api/accounts/${id}`)
                .set('Authorization', `Bearer ${token}`);
        };

        beforeEach(async () => {
            id = (await Account.query())[0].id;
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

        it('should return the account if client is logged in', async () => {
            const { body: account } = await exec();

            expect(account.data.id).toBe(id);
            expect(account.data.userId).toBe(id);
        });
    });

    describe('POST /accounts/new', () => {
        let id;
        let userId;
        let token;

        const exec = () => {
            return request(server)
                .post('/api/accounts/new')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId });
        };

        beforeEach(async () => {
            const user = await User.query().insert({
                firstName: 'Yin',
                lastName: 'Yan',
                email: 'yin1@yang.com',
                password: 'Password2@',
            });
            id = user.id;
            userId = user.id;
            token = user.generateAccessToken();
        });

        afterEach(async () => {
            await User.query().delete().where({ firstName: 'Yin' });
        });

        it('should create a new account for user if input is valid', async () => {
            const { body: newAccount } = await exec();

            const foundAccount = await Account.query().findById(id);

            expect(foundAccount).not.toBeNull();
            expect(newAccount.data.id).toBe(id);
            expect(newAccount.data).toHaveProperty('balance');
        });

        it('should return 409 if user already has an account', async () => {
            await exec();
            userId = 5;

            const res = await exec();

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if invalid user id is passed', async () => {
            userId = userId + 1;

            const res = await exec();

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 if user id is not a positive number', async () => {
            userId = 0;

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /accounts/delete/:id', () => {
        let id;
        let token;

        const exec = () => {
            return request(server)
                .delete(`/api/accounts/${id}`)
                .set('Authorization', `Bearer ${token}`);
        };

        beforeEach(async () => {
            id = (await Account.query())[0].id;
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

        it('should return 204 if id is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(204);
        });
    });

    describe('POST /accounts/fund', () => {
        let amount;
        let token;

        const exec = () => {
            return request(server)
                .post('/api/accounts/fund')
                .set('Authorization', `Bearer ${token}`)
                .send({ amount });
        };

        beforeEach(async () => {
            const token = (await User.query())[0].generateAccessToken();
        })
    });
});
