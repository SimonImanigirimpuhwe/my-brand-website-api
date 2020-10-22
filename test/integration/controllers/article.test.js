import request from 'supertest';
import mongoose from 'mongoose';
import server from '../../../src/app';
import { url } from '../../../src/models/db';
import generateToken from '../../../src/helpers/jwToken';
import Article from '../../../src/models/article';

describe('Article', () => {
    beforeAll((done) => {
        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true},
            () => mongoose.connection.dropDatabase(() => done()))
    });

    afterEach(async() => {
        await Article.deleteMany()
    });

    let token;
    let article;
    beforeEach(() => {          
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            name: 'testname',
            email: 'validemail@gmail.com',
            password: 'Test12345'
        };

        token = generateToken(user);
        const articleContent = new Array(35).join('a');
        article = {
            title: 'articleTitile',
            content: articleContent            
        };
    });

    describe('POST/ articles', () => {

        const exec = async() => {
            return request(server)
                .post('/articles')
                .set('auth-token', token)
                .send(article)
        };    
        it('should return 401 if token is not provided', async(done) => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/login to continue/)

            done()
        });
        it('should return 403 if token is invalid', async(done) => {
            token = '1234';

            const res = await exec();

            expect(res.status).toBe(403)

            done()
        });
        it('should save the new article to database', async(done) => {
            await exec();

            expect(article).not.toBeNull()

            done()
        });
    });

    describe('GET /articles', () => {
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
        it('should return 401 if token is not provided', async(done) => {
            token = '';

            const res = await request(server)
                .get('/articles')
                .set('auth-token', token)

            expect(res.status).toBe(401)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/login to continue/)

            done()
        });
        it('should return 403 if token is invalid', async(done) => {
            token = '1234';

            const res = await request(server)
                .get('/articles')
                .set('auth-token', token)

            expect(res.status).toBe(403)

            done()
        });
        it('should return 404 if no articles yet', async(done) => {
            const res = await request(server)
                .get('/articles')
                .set('auth-token', token)

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toMatch(/No Articles/)

            done()
        });
        it('should return all articles in Database', async(done) => {
            const user = {
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test12345',
                isAdmin: true
            };
    
            token = generateToken(user);
            
            const { _id, name } = user;
            const articleContent = new Array(35).join('a');
            const savedArticle = {
                title: 'testing article routes',
                author: {_id, name },
                content: articleContent
            };
            const articleInDb = await Article(savedArticle)
            
            await articleInDb.save()
            const res = await request(server)
                .get('/articles/admin')
                .set('auth-token', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('savedArticles')

            done()
        });
        it('should return all articles in Database matching the req.user ', async(done) => {
            const user = {
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test12345'
            };
    
            token = generateToken(user);
            
            const { _id, name } = user;
            const articleContent = new Array(35).join('a');
            const savedArticle = {
                title: 'testing article routes',
                author: {_id, name },
                content: articleContent
            };
            const articleInDb = await Article(savedArticle)
            
            await articleInDb.save()
            const res = await request(server)
                .get('/articles')
                .set('auth-token', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('savedArticles')

            done()
        });
    });
    
    describe('GET /articles/:_id', () => {
        it('should return 404 if no article with the given ID', async(done) => {
            const id = mongoose.Types.ObjectId().toHexString();
            const user = {
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test12345'
            };
    
            token = generateToken(user);
            
            const { _id, name } = user;
            const articleContent = new Array(35).join('a');
            const savedArticle = {
                title: 'testing article routes',
                author: {_id, name },
                content: articleContent
            };
            const articleInDb = await Article(savedArticle)
            
            await articleInDb.save()
            const res = await request(server)
                .get(`/articles/${id}`)
                .set('auth-token', token)

            expect(res.status).toBe(404)

            done()
        });
        it('should return article with the matching passed ID', async(done) => {
            const user = {
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test12345'
            };
    
            token = generateToken(user);
            
            const { _id, name } = user;
            const articleContent = new Array(35).join('a');
            const savedArticle = {
                title: 'testing article routes',
                author: {_id, name },
                content: articleContent
            };
            const articleInDb = await Article(savedArticle)
            
            const signleArticle = await articleInDb.save()
            
            const id = signleArticle._id;
           
            const res = await request(server)
                .get(`/articles/${id}`)
                .set('auth-token', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('signleArticle')

            done()
        });
    });

    describe('DELETE /articles/:_id', () => {
        it('should return 404 if no article with the given ID', async(done) => {
            const id = mongoose.Types.ObjectId().toHexString();
            const user = {
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test12345'
            };
    
            token = generateToken(user);
            
            const { _id, name } = user;
            const articleContent = new Array(35).join('a');
            const savedArticle = {
                title: 'testing article routes',
                author: {_id, name },
                content: articleContent
            };
            const articleInDb = await Article(savedArticle)
            
            await articleInDb.save()
            const res = await request(server)
                .delete(`/articles/${id}`)
                .set('auth-token', token)

            expect(res.status).toBe(404)

            done()
        });
        it('should delete article with the matching the passed ID', async(done) => {
            const user = {
                _id: mongoose.Types.ObjectId().toHexString(),
                name: 'testname',
                email: 'validemail@gmail.com',
                password: 'Test12345'
            };
    
            token = generateToken(user);
            
            const { _id, name } = user;
            const articleContent = new Array(35).join('a');
            const savedArticle = {
                title: 'testing article routes',
                author: {_id, name },
                content: articleContent
            };
            const articleInDb = await Article(savedArticle)
            
            const signleArticle = await articleInDb.save()
            
            const id = signleArticle._id;
           
            const res = await request(server)
                .delete(`/articles/${id}`)
                .set('auth-token', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message')

            done()
        });
    });
})