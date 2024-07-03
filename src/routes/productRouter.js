
// src/routes/productRouter.js
import { Router } from 'express';
import { uploader } from '../utils/multerUtil.js';
import productController from '../controllers/productController.js';
import { passportCall } from "../utils/authUtil.js";
import isAdminOrOwner from "../middleware/adminOrPremiumMiddleware.js"

const router = Router();

router.get('/', productController.getAllProducts);

router.get('/:pid', productController.getProductByID);

router.post('/', uploader.array('thumbnails', 3), isAdminOrOwner, productController.createProduct);

router.put('/:pid', uploader.array('thumbnails', 3), isAdminOrOwner, productController.updateProduct);

router.delete('/:pid', isAdminOrOwner, productController.deleteProduct);

router.post('/:cid/product/:pid', passportCall('jwt'), productController.addProductToCart);

export default router;