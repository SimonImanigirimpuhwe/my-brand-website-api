import { Router } from 'express';
import controllers from '../controllers/authentication';
import { signupValidation } from '../middleware/userValidation';


const authRouter = new Router();

authRouter
    .post('/signup', signupValidation, controllers.signupController)


export default authRouter;

