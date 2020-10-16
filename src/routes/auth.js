import { Router } from 'express';
import controllers from '../controllers/authentication';
import { signupValidation, loginValidation } from '../middlewares/userValidation';


const authRouter = new Router();

authRouter
    .post('/signup', signupValidation, controllers.signupController)
    .post('/login', loginValidation, controllers.loginController)


export default authRouter;

