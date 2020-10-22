import request from 'supertest';
import mongoose from 'mongoose';
import server from '../../../src/app';
import { url } from '../../../src/models/db';
import generateToken from '../../../src/helpers/jwToken';
import User from '../../../src/models/user';

describe('Validations', () => {
    beforeAll((done) => {
        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true},
            () => mongoose.connection.dropDatabase(() => done()))
    });

    describe('signup', () => {
        it('should return 400 if one field is missing', async(done) => {
            const user = {
                name: 'yourname',
                password: 'Test12345'
            };

            const res = await request(server).post('/users/signup').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/required/)

            done()
        });

        it('should name  is greater than 50 characters long', async(done) => {
            const longStr = new Array(52).join('a');
            const user = {
                name: longStr,
                email: 'validemail@gmail.com',
                password: 'Test12345'
            };

            const res = await request(server).post('/users/signup').send(user)

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/50 characters/)

            done()
        });

        it('should return 400 if password is greater than 150 characters long', async(done) => {
            const longPass = new Array(152).join('a');
            const user = {
                name: 'testname',
                email: 'validemail@gmail.com',
                password: longPass
            };
            const res = await request(server).post('/users/signup').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/150 characters/)

            done()
        });

        it('should return 400 if password is less than 6 characters long', async(done) => {
            const user = {
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test1'
            };
            const res = await request(server).post('/users/signup').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/ 6 characters/)
            
            done()
        });

        it('should return 400 if password is invalid', async(done) => {
            const user = {
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'password'
            };
            const res = await request(server).post('/users/signup').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/digit, lowercase and uppercase/)

            done()
        });

        it('should return 400 if email is invalid', async(done) => {
            const user = {
                name: 'testname',
                email: 'invalidemail',
                password: 'Test12345'
            };

            const res = await request(server).post('/users/signup').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/valid/)

            done()
        });
    });

    describe('Login', () => {
        it('should return 400 if one field is missing', async(done) => {
            const user = {
                password:'Test12345'
            };

            const res = await request(server).post('/users/login').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/required/)

            done()
        });

        it('should return 400 if password is invalid', async(done) => {
            const user = {
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'password'
            };
            const res = await request(server).post('/users/login').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/digit, lowercase and uppercase/)

            done()
        });

        it('should return 400 if password is less than 6 characters long', async(done) => {
            const user = {
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test1'
            };
            const res = await request(server).post('/users/login').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/ 6 characters/)
            
            done()
        });

        it('should return 400 if password is greater than 150 characters long', async(done) => {
            const longPass = new Array(152).join('a');
            const user = {
                name: 'testname',
                email: 'validemail@gmail.com',
                password: longPass
            };
            const res = await request(server).post('/users/login').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/150 characters/)

            done()
        });

        it('should return 400 if email is invalid', async(done) => {
            const user = {
                name: 'testname',
                email: 'invalidemail',
                password: 'Test12345'
            };

            const res = await request(server).post('/users/login').send(user);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/valid/)

            done()
        });
    });

    describe('Profile', () => {
        let token;
        let user;
        const exec = async() => {
            return request(server)
                .put('/users/profile')
                .set('auth-token', token)
                .send(user)
        };

        beforeEach(async() => {
            user = {
                name: 'testname',
                email: 'validemail@gmail',
                password: 'Test12345'
            };
            
            token = await generateToken(user)
        });

        it('should return 400 if one field is missing', async(done) => {
            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/required/)

            done()
        });

        it('should return 400 if biograph is less than 10 characters', async(done) => {
            const biography = new Array(8).join('a');
            user = {
                name: 'testname',
                email: 'validemail@gmail',
                password: 'Test12345',
                biograph: biography
            };

            const res = await exec();

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/at least 10 characters/)

            done()
        });
    });

    describe('Messages', () => {
        it('should return 400 if one field is missing', async(done) => {
            const message = {
                name: 'sendername',
                email: 'anyvalidemail@gmail.com'
            };

            const res = await request(server).post('/messages').send(message);

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/required/)

            done()
        });

        it('should return 400 if email is invalid', async(done) => {
            const message = {
                name: 'sendername',
                email: 'invalidemail',
                message: 'message'
            };

            const res = await request(server).post('/messages').send(message)

            expect(res.status).toBe(400)

            done()
        });

        it('should return 400 if message is greater than 100 characters', async(done) => {
            const longMessage = new Array(102).join('a')
            const message = {
                name: 'sendername',
                email: 'anyvalidemail@gmail.com',
                message: longMessage
            };

            const res = await request(server).post('/messages').send(message)

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/less than 100 characters/)

            done()
        });
    });

    describe('Articles', () => {
        let token;
        let article;
        
        const exec = async() => {
            return request(server)
                .post('/articles')
                .set('auth-token', token)
                .send(article)
        };

        beforeEach(async() => {
            article = {
                title: 'articleTitle',
                content: 'any article body content'
            };
            
            token = await generateToken(new User())
        });
        it('should return 400 if one field is missing', async(done) => {           
            article = {
                title: 'articleTitle'
            };
            const res = await exec();

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/required/)

            done()
        });

        it('should return 400 if content is less 30 characters long', async(done) => {
            
            const res = await exec();

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/at least 30 characters/)

            done();
        });
    });
});