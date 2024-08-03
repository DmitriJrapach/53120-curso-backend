
// src/routes/viewRouter.js
import { Router } from 'express';
import viewController from '../controllers/viewController.js';
import isUserOrPremiumOwner from '../middleware/userOrPremiumOwnerMiddleware.js';
import { isAdmin, isPremium } from '../middleware/roleMiddleware.js';

const router = Router();

router.get("/products", viewController.isAuthenticated, viewController.getProducts);

router.get('/realtimeproducts', viewController.isAuthenticated, viewController.getRealTimeProducts);

router.get("/chat", viewController.isAuthenticated, viewController.chat);

router.get("/login", viewController.login);

router.get("/logout", viewController.logout);

router.get("/register", viewController.register);

router.get("/cart/:cid", viewController.isAuthenticated, viewController.getCartView);

router.get("/mockingproducts", viewController.mockProducts);

router.get("/loggerTest", (req, res) => {
  req.logger.fatal("Logger test fatal message");
  req.logger.error("Logger test error message");
  req.logger.warning("Logger test warning message");
  req.logger.info("Logger test info message");
  req.logger.http("Logger test http message");
  req.logger.debug("Logger test debug message");

  res.send("Logger test completed!"); 
});

router.get('/forgot-password', viewController.forgotPassword);

router.get('/reset-password/:token', viewController.getResetPassword);

router.get('/admin/dashboard', isAdmin, viewController.adminDashboard);

router.get('/user/dashboard', isUserOrPremiumOwner, viewController.userDashboard);

router.get('/premium/dashboard', isPremium, viewController.premiumDashboard);

export default router;