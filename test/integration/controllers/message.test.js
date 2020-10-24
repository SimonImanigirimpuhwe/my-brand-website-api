import request from 'supertest';
import mongoose from 'mongoose';
import server from '../../../src/app';
import { url } from '../../../src/models/db';
import Message from '../../../src/models/message';
import generateToken from '../../../src/helpers/jwToken';

describe('Messages', () => {
    beforeAll((done) => {
        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true},
            () => mongoose.connection.dropDatabase(() => done()))
    });

    afterEach(async() => {
        await Message.deleteMany()
    });
    
    describe('POST /messages', () => {
        let messageToSend;
        const exec = async() => {
            return  request(server)
                .post('/messages')
                .send(messageToSend)
        }
        beforeEach(() => {
            messageToSend = {
                name: 'sendName',
                email: 'sender@gmail.com',
                message: 'message for testing'
            };
        });

        it('should return 400 if message was already sent', async(done) => {
            try {
                messageToSend = {
                    name: 'sendName',
                    email: 'sender@gmail.com',
                    message: 'message for testing'
                };
                const newMessage= await Message(messageToSend)
                await newMessage.save()
                const res = await exec()
                
                expect(res.status).toBe(400)
                expect(res.body).toHaveProperty('error')
                expect(res.body.error).toMatch(/sent before/)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return save message', async(done) => {
            try {
                const res = await exec();
    
                expect(res.status).toBe(201)
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toMatch(/Message Sent/)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return saved message', async(done) => {
            try {
                const res = await exec();
    
                expect(res.status).toBe(201)
                expect(res.body).toHaveProperty('savedMessage')
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                done(err)
            }
        })
    });

    describe('GET /messages', () => {
        let token;
        let messageToSend;
        const exec = async() => {
            return  request(server)
                .get('/messages')
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
        it('should return 404 if no message in DB yet', async(done) => {
            try {
                const res = await exec();
    
                expect(res.status).toBe(404)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return all mesages in DB', async(done) => {
            try {
                messageToSend = {
                    name: 'sendName',
                    email: 'sender@gmail.com',
                    message: 'message for testing'
                };
                const newMessage= await Message(messageToSend)
                await newMessage.save()
    
                const res = await exec()
    
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('allMessages')
    
                done()
                
            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
    });

    describe('DELETE /messages', () => {
        let token;
        const exec = async(id) => {
            return  request(server)
                .delete(`/messages/${id}`)
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
        it('should return 404 if no message with the given ID', async(done) => {
            try {
                const id = mongoose.Types.ObjectId().toHexString();
                const messageToSend = {
                    name: 'sendName',
                    email: 'sender@gmail.com',
                    message: 'message for testing'
                };
                const newMessage= await Message(messageToSend)
                await newMessage.save()
    
                const res = await exec(id);
    
                expect(res.status).toBe(404)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should delete a message with a given ID', async(done) => {
            try {
                const messageToSend = {
                    name: 'sendName',
                    email: 'sender@gmail.com',
                    message: 'message for testing'
                };
                const newMessage = await Message(messageToSend)
                const messageToDelete = await newMessage.save()
                const id = messageToDelete._id;
    
                const res = await exec(id);
    
                expect(res.status).toBe(200)
    
                done()
                
            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done()
            }
        });
    });
});