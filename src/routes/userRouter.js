import { Router } from 'express';
import passport from 'passport';
import userController from '../controllers/userController.js';
import { passportCall } from "../utils/authUtil.js";

const router = Router();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), userController.githubAuth);

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/login' }), userController.githubCallback);

router.post("/register", userController.register);

router.post('/login', userController.login);

router.get('/current', passportCall('jwt'), userController.current);

router.get('/:uid', passportCall('jwt'), userController.getUser);

router.post("/logout", userController.logout);

export default router;
