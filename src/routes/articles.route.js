import { Router } from 'express';
import articleController from '../controllers/articles';
import { auth } from '../middlewares/authorization';
import upload from '../middlewares/photo';
import { 
    newArticleValidation, 
    editArticleValidation 
} from '../middlewares/articleValidation';


const articleRoutes = new Router();

articleRoutes
    .post('/', auth, upload.single('articleImage'), newArticleValidation, articleController.addArticle)
    .get('/admin', articleController.adminGetArticles)
    .get('/', auth, articleController.getArticles)
    .put('/:_id', auth, upload.single('articleImage'), editArticleValidation, articleController.editArticle)
    .get('/:_id', articleController.getSingleArticle)
    .delete('/:_id', auth, articleController.deleteArticle)


export default articleRoutes;