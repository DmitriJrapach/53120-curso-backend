import { Router } from 'express';
import passport from 'passport';
import userController from '../controllers/userController.js';
import { passportCall } from "../utils/authUtil.js";
import isAdmin from "../middleware/adminMiddleware.js"

const router = Router();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), userController.githubAuth);

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/login' }), userController.githubCallback);

router.get('/admin/users', passportCall('jwt'), isAdmin, userController.getAllUsers);

router.get('/current', passportCall('jwt'), isAdmin, userController.current);

router.get('/:uid', passportCall('jwt'), isAdmin, userController.getUser);

router.post("/register", userController.register);

router.post('/login', userController.login);

router.put('/premium/:uid', passportCall('jwt'), isAdmin, userController.changeUserRole);

router.post("/logout", userController.logout);

// Endpoint para manejar la solicitud de recuperación de contraseña
router.post('/forgot-password', userController.requestPasswordReset);

// Endpoint para manejar la actualización de la contraseña
router.post('/reset-password', userController.resetPassword);

export default router;