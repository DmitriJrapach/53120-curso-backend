// src/routes/userRoutes.js
import { Router } from 'express';
import passport from 'passport';
import userController from '../controllers/userController.js';
import { authorization } from "../middleware/auth.js";

const router = Router();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), userController.githubAuth);

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/login' }), userController.githubCallback);

router.post("/register", userController.register);

router.post('/login', userController.login);

router.get('/current', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) { return next(err); }
            next();
        });
    })(req, res, next);
}, userController.current);

router.get('/:uid', passport.authenticate('jwt', { session: false }), authorization, userController.getUser);

router.post("/logout", userController.logout);

export default router;
