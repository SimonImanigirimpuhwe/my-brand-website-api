import request from 'supertest';
import mongoose from 'mongoose';
import server from '../../../src/app';
import { url } from '../../../src/models/db';
import Comment from '../../../src/models/comment';
import generateToken from '../../../src/helpers/jwToken';
import Article from '../../../src/models/article';



describe('Comments', () => {
    beforeAll((done) => {
        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true},
            () => mongoose.connection.dropDatabase(() => done()))
    });

    afterEach(async() => {
        await Comment.deleteMany()
    });
    
    describe('POST /comments/:_id', () => {
        let token;
        let addComment;
        const exec = async(id) => {
            return  request(server)
                .post(`/comments/${id}`)
                .set('auth-token', token)
                .send(addComment)
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

            addComment = {
                articleId: mongoose.Types.ObjectId().toHexString(),
                sender: 'sender@gmail.com',
                commentContent: 'message for testing'
            };
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
                token = '12345';
    
                const res = await exec();
    
                expect(res.status).toBe(403)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return 404 if no article with the given ID', async(done) => {
            try {
                const user = {
                    _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'testname',
                    email: 'validemail@gmail.com',
                    password: 'Test12345',
                    isAdmin: true
                };
    
                const id = mongoose.Types.ObjectId().toHexString();
    
                const { _id, name } = user;
                const articleContent = new Array(35).join('a');
                const savedArticle = {
                    title: 'testing article routes',
                    author: {_id, name },
                    content: articleContent
                };
                const articleInDb = await Article(savedArticle)
                
                await articleInDb.save()
    
                const res = await exec(id)
    
                expect(res.status).toBe(404)
    
                done()

            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        })
        it('should save comments to the corresponding article with the given ID', async(done) => {           
            try {
                const user = {
                    _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'testname',
                    email: 'validemail@gmail.com',
                    password: 'Test12345',
                    isAdmin: true
                };
                const { _id, name } = user;
                const articleContent = new Array(35).join('a');
    
                const savedArticle = {
                    title: 'testing comments',
                    author: {_id, name },
                    content: articleContent
                };
                const aarticleToSave = await Article(savedArticle)
                
                const signleArticle = await aarticleToSave.save()
                
                const id = signleArticle._id;
    
                const res = await exec(id)
    
                expect(res.status).toBe(200)
    
                done()
            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
    });

    describe('GET /comments/:_id', () => {
        const exec = async(id) => {
            return  request(server)
                .get(`/comments/${id}`)
        };
        it('should return 404 if no article with the given ID', async(done) => {
            try {

                const user = {
                    _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'testname',
                    email: 'validemail@gmail.com',
                    password: 'Test12345'
                };
    
                const id = mongoose.Types.ObjectId().toHexString();
    
                const { _id, name } = user;
                const articleContent = new Array(35).join('a');
                const savedArticle = {
                    title: 'new article to comment on',
                    author: {_id, name },
                    content: articleContent
                };
                const articleInDb = await Article(savedArticle)
                
                await articleInDb.save()
    
                const res = await exec(id)
    
                expect(res.status).toBe(404)
    
                done()
            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }
        });
        it('should return all comments corresponding to the given article ID', async(done) => {
            try {

                const user = {
                    _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'testname',
                    email: 'validemail@gmail.com',
                    password: 'Test12345'
                };
    
                const token = generateToken(user);
    
                const addComment = {
                    articleId: mongoose.Types.ObjectId().toHexString(),
                    sender: 'sender@gmail.com',
                    commentContent: 'message for testing'
                };
    
                const { _id, name } = user;
                const articleContent = new Array(35).join('a');
    
                const savedArticle = {
                    title: 'new article',
                    author: {_id, name },
                    content: articleContent
                };
                const aarticleToSave = await Article(savedArticle)
                
                const signleArticle = await aarticleToSave.save()
                
                const id = signleArticle._id;
    
                await request(server)
                    .post(`/comments/${id}`)
                    .set('auth-token', token)
                    .send(addComment)
    
                const res = await exec(id)
    
                expect(res.status).toBe(200)
    
                done()
            } catch (err) {
                // eslint-disable-next-line
                console.log(err.message)
                done(err)
            }

        });
    });
});