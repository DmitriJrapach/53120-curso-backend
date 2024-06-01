// src/routes/cartRouter.js
import { Router } from 'express';
import cartController from '../controllers/cartController.js';
import { passportCall } from "../utils/authUtil.js";

const router = Router();

router.get('/', cartController.getAllCarts);

router.get('/:cid', cartController.getCartById);

router.post('/', cartController.createCart);

router.post('/:cid/product/:pid', passportCall('jwt'), cartController.addProductByID);

router.delete('/:cid/products/:pid', cartController.removeProductByID);

router.put('/:cid', cartController.updateCart);

router.put('/:cid/products/:pid', cartController.updateProductQuantity);

router.delete('/:cid', cartController.deleteCart);

router.get('/:cid/view', passportCall('jwt'), cartController.getCartView);

router.post('/:cid/checkout', passportCall('jwt'), cartController.checkout);

export default router;
