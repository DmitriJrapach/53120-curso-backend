
// src/routes/productRouter.js
import { Router } from 'express';
import upload from '../utils/multerUtil.js';
import productController from '../controllers/productController.js';
import { passportCall } from "../utils/authUtil.js";
import isAdminOrOwner from "../middleware/adminOrPremiumOwnerMiddleware.js"
import { isAdminOrPremium } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', productController.getAllProducts);

router.get('/:pid', productController.getProductById);

router.post('/', upload.array('thumbnails', 3), isAdminOrOwner, productController.createProduct);

router.put('/:pid', upload.array('thumbnails', 3), isAdminOrOwner, productController.updateProduct);

router.delete('/:pid', isAdminOrPremium, productController.deleteProduct);

router.post('/:cid/product/:pid', passportCall('jwt'), productController.addProductToCart);

export default router;