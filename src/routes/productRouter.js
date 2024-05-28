
// src/routes/productRouter.js
import { Router } from 'express';
import { uploader } from '../utils/multerUtil.js';
import productController from '../controllers/productController.js';

const router = Router();

router.get('/', productController.getAllProducts);

router.get('/:pid', productController.getProductByID);

router.post('/', uploader.array('thumbnails', 3), productController.createProduct);

router.put('/:pid', uploader.array('thumbnails', 3), productController.updateProduct);

router.delete('/:pid', productController.deleteProduct);

export default router;
