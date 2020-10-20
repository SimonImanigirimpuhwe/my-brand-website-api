import { Router } from 'express';
import userController from '../controllers/users';
import { auth, adminAuth } from '../middlewares/authorization';

const usersRoute = new Router();

usersRoute
    .get('/', [auth, adminAuth], userController.getUsers)
    .delete('/:_id', [auth, adminAuth], userController.deleteUser)
    .put('/:_id', [auth, adminAuth], userController.editUser)


export default usersRoute;