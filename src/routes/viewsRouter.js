
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

// Ruta para renderizar la vista de solicitud de email para la recuperación de contraseña
router.get('/forgot-password', viewController.forgotPassword);

// Ruta para validar el token y renderizar la vista de restablecimiento de contraseña
router.get('/reset-password/:token', viewController.getResetPassword);

export default router;