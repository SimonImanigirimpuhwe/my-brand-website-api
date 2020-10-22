import request from 'supertest';
import mongoose from 'mongoose';
import server from '../../../src/app';
import { url } from '../../../src/models/db';
import User from '../../../src/models/user';

describe('Signup', () => {
    beforeAll((done) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true},
            () => mongoose.connection.dropDatabase(() => done()))
    });
    
    afterEach(async() => {
        await User.deleteMany()
    });

    describe('/users/signup', () => {
        it('should return 400 if user already exist', async(done) => {
            const user = {
                name: 'newname',
                email: 'validemail@gmail.com',
                password: 'Test12345'
            };
            const newUser = await User(user)
            await newUser.save()
            const res = await request(server).post('/users/signup').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')

            done()
        });
        it('should create new account', async (done) => {
            const user = {
                name: 'newname',
                email: 'validemail@gmail.com',
                password: 'Test12345'
            };

            const res = await request(server).post('/users/signup').send(user);

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('message')

            done()
        })
    });
});
