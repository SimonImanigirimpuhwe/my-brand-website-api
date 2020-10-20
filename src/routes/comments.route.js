import { Router } from 'express';
import commentController from '../controllers/comments';
import { auth } from '../middlewares/authorization';

const commentRoutes = new Router();

commentRoutes
    .post('/:_id', auth, commentController.addComment)
    .get('/:_id', commentController.getComment)



export default commentRoutes;