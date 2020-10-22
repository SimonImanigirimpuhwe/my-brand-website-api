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
        });
        it('should return save message', async(done) => {
            const res = await exec();

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toMatch(/Message Sent/)

            done()
        });
        it('should return saved message', async(done) => {
            const res = await exec();

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('savedMessage')

            done()
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
            token = '';
            const res = await exec();

            expect(res.status).toBe(401)

            done()
        });
        it('should return 403 if token is invalid', async(done) => {
            token = '1234';
            const res = await exec();

            expect(res.status).toBe(403)

            done()
        });
        it('should return 404 if no message in DB yet', async(done) => {
            const res = await exec();

            expect(res.status).toBe(404)

            done()
        });
        it('should return all mesages in DB', async(done) => {
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
            token = '';
            const res = await exec();

            expect(res.status).toBe(401)

            done()
        });
        it('should return 403 if token is invalid', async(done) => {
            token = '1234';
            const res = await exec();

            expect(res.status).toBe(403)

            done()
        });
        it('should return 404 if no message with the given ID', async(done) => {
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
        });
        it('should delete a message with a given ID', async(done) => {
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
        });
    });
});