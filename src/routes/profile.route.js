import { Router } from 'express';
import profileController from '../controllers/profile';
import { auth } from '../middlewares/authorization';
import upload from '../middlewares/photo';
import { updateProfileValidation } from '../middlewares/userValidation';


const profileRoutes = new Router();

profileRoutes
    .put('/', auth, updateProfileValidation, profileController.updateProfile)
    .post('/', auth, upload.single('profileImag'), profileController.updateProfileImage)
    .get('/', auth, profileController.getProfile)


export default profileRoutes;