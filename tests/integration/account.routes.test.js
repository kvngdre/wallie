const Account = require('../../src/models/account.model');
const request = require('supertest');
const User = require('../../src/models/user.model');

let server;

describe('accounts', () => {
    beforeEach(() => (server = require('../../src/server')));
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

        beforeEach(() => {
            token = new User().generateAccessToken();
        });

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
        let userId;
        let token;

        const exec = () => {
            return request(server)
                .post('/api/accounts/new')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId });
        };

        beforeEach(async () => {
            const users = await User.query();
            const user = users[users.length - 1];
            userId = user.id;
            token = user.generateAccessToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should create a new account for user if input is valid', async () => {
            const { body: newAccount } = await exec();

            const foundAccount = await Account.query().findOne({ userId });

            expect(foundAccount).not.toBeNull();
            expect(foundAccount.userId).toBe(userId);
            expect(newAccount.data.id).toBe(userId);
            expect(newAccount.data).toHaveProperty('balance');
        });

        it('should return 409 if user already has an account', async () => {
            const res = await exec();

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 if user id is less than or equal to 0', async () => {
            userId = 0;

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 404 if user id is invalid', async () => {
            userId += 1;
            const res = await exec();

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /accounts/delete/:id', () => {
        let userId;
        let token;

        const exec = () => {
            return request(server)
                .delete(`/api/accounts/${userId}`)
                .set('Authorization', `Bearer ${token}`);
        };

        beforeEach(async () => {
            const users = await User.query();
            const user = users[users.length - 1];
            userId = user.id;
            token = user.generateAccessToken();
        });

        it('should return 204 if id is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(204);
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if invalid id is passed', async () => {
            userId = 0;

            const res = await exec();

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
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
            const user = (await User.query())[0];
            userId = user.id;
            token = user.generateAccessToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should fund account if input is valid', async () => {
            amount = 100;

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('credit');
        });

        it.each([[-1], [0]])(
            'should return 400 if amount is less than or equal to 0',
            async (val) => {
                amount = val;

                const res = await exec();

                expect(res.status).toBe(400);
                expect(res.body.success).toBe(false);
            }
        );
    });

    describe('POST /accounts/balance', () => {
        let id = 1;
        let userId;
        let token;

        const exec = () => {
            return request(server)
                .get('/api/accounts/balance')
                .set('Authorization', `Bearer ${token}`);
        };

        beforeEach(async () => {
            id++;
            const user = await User.query().findById(id);
            userId = user.id;
            token = user.generateAccessToken();
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return the user balance', async () => {
            const res = await exec();

            expect(res.body.data).toHaveProperty('balance');
            expect(res.body.data.id).toBe(userId);
        });

        it('should return 404 if account does not exist', async () => {
            const res = await exec();

            expect(res.body.success).toBe(false);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /accounts/debit', () => {
        let id = 4;
        let amount;
        let token;

        const exec = () => {
            return request(server)
                .post('/api/accounts/debit')
                .set('Authorization', `Bearer ${token}`)
                .send({ amount });
        };

        beforeEach(async () => {
            const user = await User.query().findById(id);
            token = user.generateAccessToken();
            id--;
            // if(id===0) id = 5
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';
            id = 4;

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if account does not exist', async () => {
            id = 4;
            amount = 300;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it.each([[-1], [0]])(
            'should return 400 if amount is less than or equal to 0',
            async (val) => {
                amount = val;

                const res = await exec();

                expect(res.status).toBe(400);
            }
        );

        it('should return 402 if account balance is less than amount', async () => {
            amount = 300;

            const res = await exec();

            expect(res.status).toBe(402);
        });

        it('should debit account if amount is valid and balance is greater than or equal to amount', async () => {
            amount = 100;

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toMatch(/success/);
        });
    });

    describe('POST /accounts/transfer', () => {
        let id = 4;
        let amount;
        let token;
        let destinationAccountId;

        const exec = () => {
            return request(server)
                .post('/api/accounts/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send({ amount, destinationAccountId });
        };

        beforeEach(async () => {
            const user = await User.query().findById(id);
            token = user.generateAccessToken();
            id--;
        });

        it('should return 401 if client is not logged in', async () => {
            id = 4;
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if source account does not exist', async () => {
            amount = 100;
            destinationAccountId = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if destination account does not exist', async () => {
            id = 4;
            amount = 100;
            destinationAccountId = 4;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 400 if amount is less than or equal to 0', async () => {
            amount = 0;
            destinationAccountId = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if source and destination account are the same', async () => {
            amount = 100;
            destinationAccountId = 3;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 402 if source account balance is less than amount', async () => {
            amount = 300;
            destinationAccountId = 1;

            const res = await exec();

            expect(res.status).toBe(402);
        });

        it('should return 200 if amount and destination account are valid', async () => {
            amount = 100;
            destinationAccountId = 2;

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toMatch(/success/);
        });
    });
});
