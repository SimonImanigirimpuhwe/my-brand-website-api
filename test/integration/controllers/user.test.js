import request from 'supertest';
import mongoose from 'mongoose';
import server from '../../../src/app';
import { url } from '../../../src/models/db';
import User from '../../../src/models/user';
import generateToken from '../../../src/helpers/jwToken';


describe('Manage users', () => {
    beforeAll((done) => {
        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true},
            () => mongoose.connection.dropDatabase(() => done()))
    });

    afterEach(async() => {
        await User.deleteMany()
    });
    
    describe('GET /users/info', () => {
        let token;

        const exec = async() => {
            return  request(server)
                .get('/users/info')
                .set('auth-token', token)
        };
        beforeEach(() => {
            const user = {
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test12345',
                isAdmin: true
            };
    
            token = generateToken(user);

        });
        it('should return 401 if no token provided', async(done) => {
            try {
                token = '';
                const res = await exec();
    
                expect(res.status).toBe(401)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return 403 if token is invalid', async(done) => {
            try {
                token = '1234';
                const res = await exec();
    
                expect(res.status).toBe(403)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return all users in DB', async(done) => {
            try {
                const res = await exec();
    
                expect(res.status).toBe(200)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
    });

    describe('DELETE /users/info/:_id', () => {
        let token;
        const exec = async(id) => {
            return  request(server)
                .delete(`/users/info/${id}`)
                .set('auth-token', token)
        };
        beforeEach(() => {
            
            const user = {
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test12345',
                isAdmin: true
            };
    
            token = generateToken(user);
        });
        it('should return 401 if no token provided', async(done) => {
            try {
                token = '';
                const res = await exec();
    
                expect(res.status).toBe(401)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return 403 if token is invalid', async(done) => {
            try {
                token = '1234';
                const res = await exec();
    
                expect(res.status).toBe(403)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return 404 if no user with the given ID', async(done) => {
            try {
                const id = mongoose.Types.ObjectId().toHexString();
                const userToSave = {
                    _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'testname',
                    email: 'validemail@gmail.com',
                    password: 'Test12345'
                };
                const newUser= await User(userToSave)
                await newUser.save()
    
                const res = await exec(id);
    
                expect(res.status).toBe(404)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should delete a user with a given ID', async(done) => {
            try {
                const userToDelete = {
                    _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'testname',
                    email: 'validemail@gmail.com',
                    password: 'Test12345'
                };
                const newUser = await User(userToDelete)
                const userAccountToRemove = await newUser.save()
                const id = userAccountToRemove._id;
    
                const res = await exec(id);
    
                expect(res.status).toBe(200)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
    });

    describe('PUT /users/info/:_id', () => {
        let token;
        const info = {
            isAdmin: true || false,
            isActive: false
        }
        const exec = async(id) => {
            return  request(server)
                .put(`/users/info/${id}`)
                .set('auth-token', token)
                .send(info)
        };
        beforeEach(() => {
            
            const user = {
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test12345',
                isAdmin: true
            };
    
            token = generateToken(user);
        });
        it('should return 401 if no token provided', async(done) => {
            try {
                token = '';
                const res = await exec();
    
                expect(res.status).toBe(401)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return 403 if token is invalid', async(done) => {
            try {
                token = '1234';
                const res = await exec();
    
                expect(res.status).toBe(403)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return 404 if no user with the given ID', async(done) => {
            try {
                const id = mongoose.Types.ObjectId().toHexString();
                const userToSave = {
                    _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'testname',
                    email: 'validemail@gmail.com',
                    password: 'Test12345'
                };
                const newUser= await User(userToSave)
                await newUser.save()
    
                const res = await exec(id);
    
                expect(res.status).toBe(404)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should update a user with a given ID', async(done) => {
            try {
                const userToDelete = {
                    _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'testname',
                    email: 'validemail@gmail.com',
                    password: 'Test12345'
                };
                const newUser = await User(userToDelete)
                const userAccountToRemove = await newUser.save()
                const id = userAccountToRemove._id;
    
                const res = await exec(id);
    
                expect(res.status).toBe(200)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
    })
})