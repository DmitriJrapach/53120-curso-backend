// src/routes/cartRouter.js
import { Router } from 'express';
import cartController from '../controllers/cartController.js';
import { passportCall } from "../utils/authUtil.js";
import isUser from '../middleware/userMiddleware.js';

const router = Router();

router.get('/', cartController.getAllCarts);

router.get('/:cid', passportCall('jwt'), cartController.getCartById);

router.post('/', cartController.createCart);

router.post('/:cid/product/:pid', passportCall('jwt'), isUser, cartController.addProductByID);

router.post('/:cid/checkout', passportCall('jwt'), cartController.checkout);

router.put('/:cid', cartController.updateCart);

router.put('/:cid/products/:pid', cartController.updateProductQuantity);

router.delete('/:cid', cartController.deleteCart);

router.delete('/:cid/products/:pid', passportCall('jwt'), cartController.removeProductByID);

export default router;