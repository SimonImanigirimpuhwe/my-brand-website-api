import request from 'supertest';
import mongoose from 'mongoose';
import server from '../../../src/app';
import { url} from '../../../src/models/db';


describe('login', () => {
    beforeAll((done) => {
        mongoose.connect(url, 
            { useUnifiedTopology: true, useNewUrlParser: true },
            () => mongoose.connection.dropDatabase(() => done()))
    });

    beforeEach(async() => {
        const user = {
            name: 'testname',
            email: 'validemail@gmail.com',
            password: 'Test12345'
        };

        await request(server).post('/users/signup').send(user);
    });
    

    describe('/users/login', () => {
        it('should return 400 if email is invalid', async (done) => {
            try {
                const user = {
                    email: 'invalidemail',
                    password: 'Test12345'
                };
                const res = await request(server).post('/users/login').send(user);
    
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('error')
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return 400 if password is invalid', async (done) => {
            try {
                const user = {
                    email: 'validemail@gmail.com',
                    password: 'wrongpassword'
                };
    
                const res = await request(server).post('/users/login').send(user);
    
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('error')
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should allow login if valid credentials passed', async(done) => {
            try {
                const user = {
                    email: 'validemail@gmail.com',
                    password: 'Test12345'   
                };
    
                const res = await request(server).post('/users/login').send(user);
    
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('message')
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
    });
});