const request = require('supertest');

let server;

describe('users', () => {
    
    beforeEach(() => { server = require('../../server')})
    afterEach(() => { server.close() })

    // it('should create ')

    it('should return all users', async () => {
        const res = await request(server).get('/api/users/');
        expect(res.status).toBe(401);
        // expect(res.body.payload.message).toBe('Users not found')
    });
});
