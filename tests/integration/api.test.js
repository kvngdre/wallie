const request = require('supertest');

let server;

describe('API health check', () => {
    beforeEach(() => (server = require('../../src/server')));
    afterEach(() => {
        server.close();
    });

    describe('GET - check the health of the api - /status', () => {
        it('returns status code 200 if API is up and running', async () => {
            const response = await request(server).get('/status');

            expect(response.status).toBe(200);
        });
    });
});
