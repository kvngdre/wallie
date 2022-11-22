const request = require('supertest');
const Transaction = require('../../models/transaction.model');
const User = require('../../models/user.model');

let server;

describe('transactions', () => {
    beforeEach(() => (server = require('../../server')));
    afterEach(() => {
        server.close();
    });

    describe('GET /transactions', () => {
        let token;

        const exec = () => {
            return request(server)
                .get('/api/transactions')
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
            const { body: transactions } = await exec();

            expect(transactions.data.length).toBeGreaterThanOrEqual(3);
            expect(
                transactions.data.some((t) => t.accountId === 1)
            ).toBeTruthy();
        });
    });

    describe('GET /transactions/:id', () => {
        let id;
        let token;

        const exec = () => {
            return request(server)
                .get(`/api/transactions/${id}`)
                .set('Authorization', `Bearer ${token}`);
        };

        beforeEach(async () => {
            id = (await Transaction.query())[0].id;
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
            const { body: transaction } = await exec();

            expect(transaction.data.id).toBe(id);
            expect(transaction.data.accountId).toBe(id);
        });
    });
});
