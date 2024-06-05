
// src/routes/viewRouter.js
import { Router } from 'express';
import viewController from '../controllers/viewController.js';

const router = Router();

router.get("/products", viewController.isAuthenticated, viewController.getProducts);

router.get('/realtimeproducts', viewController.isAuthenticated, viewController.getRealTimeProducts);

router.get("/chat", viewController.isAuthenticated, viewController.chat);

router.get("/login", viewController.login);

router.get("/logout", viewController.logout);

router.get("/register", viewController.register);

router.get("/cart/:cid", viewController.isAuthenticated, viewController.getCartView);

export default router;