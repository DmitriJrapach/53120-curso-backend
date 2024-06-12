
// src/routes/viewRouter.js
import { Router } from 'express';
import viewController from '../controllers/viewController.js';
import { generateProducts } from "../utils/mockUtil.js";

const router = Router();

router.get("/products", viewController.isAuthenticated, viewController.getProducts);

router.get('/realtimeproducts', viewController.isAuthenticated, viewController.getRealTimeProducts);

router.get("/chat", viewController.isAuthenticated, viewController.chat);

router.get("/login", viewController.login);

router.get("/logout", viewController.logout);

router.get("/register", viewController.register);

router.get("/cart/:cid", viewController.isAuthenticated, viewController.getCartView);

router.get("/mockingproducts", (_req, res) => {
    let products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProducts());
    }
    res.render('mocking', { title: 'Mocking Products', products });
  });

export default router;