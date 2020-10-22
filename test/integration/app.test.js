import request from 'supertest';
import server from '../../src/app';

describe('Default route', () => {
    it('should return 200 when navigated to it', async(done) => {
        const res = await request(server).get('/');

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/Welcome/)

        done()
    })
})