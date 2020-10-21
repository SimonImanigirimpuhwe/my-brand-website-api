import { Router } from 'express';
import passport from '../middlewares/googleOauth';

const googleRoutes = new Router();

googleRoutes
    .use(passport.initialize())
    .get('/google', passport.authenticate('google', { scope: ['profile', 'email']}))

    .get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), 
        (req, res) => {
            res.redirect('/login')
        })
    .get('/logout', (req, res) => {
        req.logout();
        res.redirect('/users/login')
    })

export default googleRoutes;