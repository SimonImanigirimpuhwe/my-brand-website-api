import { Router } from 'express';
import messageController  from '../controllers/message/index';
import messageValidation from '../middlewares/messageValidation ';
import { auth, adminAuth } from '../middlewares/authorization';

const messageRoute = new Router();

messageRoute
    .post('/', messageValidation, messageController.sendMessage)
    .get('/', [auth, adminAuth], messageController.getMessages)
    .delete('/:_id', [auth, adminAuth], messageController.deleteMessage)


export default messageRoute;