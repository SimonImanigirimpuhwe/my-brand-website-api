import { Router } from 'express';
import articleController from '../controllers/articles';
import { adminAuth, auth } from '../middlewares/authorization';
import { 
    newArticleValidation, 
    editArticleValidation 
} from '../middlewares/articleValidation';

const articleRoutes = new Router();

articleRoutes
    .post('/', auth, newArticleValidation, articleController.addArticle)
    .get('/admin', [auth, adminAuth], articleController.adminGetArticles)
    .get('/', auth, articleController.getArticles)
    .put('/:_id', auth, editArticleValidation, articleController.editArticle)
    .get('/:_id', auth, articleController.getSingleArticle)
    .delete('/:_id', auth, articleController.deleteArticle)


export default articleRoutes;