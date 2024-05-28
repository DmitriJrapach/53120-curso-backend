
// import { Router } from 'express';
// import { productManagerDB } from "../dao/productManagerDB.js"
// import { cartManagerDB } from "../dao/cartManagerDB.js"

// const router = Router();
// const ProductService = new productManagerDB();
// const CartService = new cartManagerDB();

// // GET /api/carts/:cid
// router.get('/', async (req, res) => {
//     try {
//         const result = await CartService.getAllCarts();
//         res.send({
//             status: 'success',
//             payload: result
//         });
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// router.get('/:cid', async (req, res) => {
//     try {
//         const result = await CartService.getCartById(req.params.cid);
//         res.send({
//             status: 'success',
//             payload: result
//         });
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error.message
//         });
//     }
// });



// // POST /api/carts
// router.post('/', async (req, res) => {
//     try {
//         const result = await CartService.createCart();
//         res.send({
//             status: 'success',
//             payload: result
//         });
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// // POST /api/carts/:cid/product/:pid
// router.post('/:cid/product/:pid', async (req, res) => {
//     try {
//         const result = await CartService.addProductByID(req.params.cid, req.params.pid);
//         res.send({
//             status: 'success',
//             payload: result
//         });
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// // DELETE /api/carts/:cid/products/:pid
// router.delete('/:cid/products/:pid', async (req, res) => {
//     try {
//         const result = await CartService.removeProductByID(req.params.cid, req.params.pid);
//         res.send({
//             status: 'success',
//             payload: result
//         });
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// // PUT /api/carts/:cid
// router.put('/:cid', async (req, res) => {
//     try {
//         const result = await CartService.updateCart(req.params.cid, req.body.products);
//         res.send({
//             status: 'success',
//             payload: result
//         });
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// // PUT /api/carts/:cid/products/:pid
// router.put('/:cid/products/:pid', async (req, res) => {
//     try {
//         const result = await CartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
//         res.send({
//             status: 'success',
//             payload: result
//         });
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// // DELETE /api/carts/:cid
// router.delete('/:cid', async (req, res) => {
//     try {
//         const result = await CartService.deleteCart(req.params.cid);
//         res.send({
//             status: 'success',
//             payload: result
//         });
//     } catch (error) {
//         res.status(400).send({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// export default router;

// src/routes/cartRouter.js
import { Router } from 'express';
import cartController from '../controllers/cartController.js';

const router = Router();

router.get('/', cartController.getAllCarts);

router.get('/:cid', cartController.getCartById);

router.post('/', cartController.createCart);

router.post('/:cid/product/:pid', cartController.addProductByID);

router.delete('/:cid/products/:pid', cartController.removeProductByID);

router.put('/:cid', cartController.updateCart);

router.put('/:cid/products/:pid', cartController.updateProductQuantity);

router.delete('/:cid', cartController.deleteCart);

export default router;
