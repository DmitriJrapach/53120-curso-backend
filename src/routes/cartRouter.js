// src/routes/cartRouter.js
import { Router } from 'express';
import cartController from '../controllers/cartController.js';
import { passportCall } from "../utils/authUtil.js";
import isUser from '../middleware/userMiddleware.js';
import cartService from "../services/cartService.js";
import productService from "../services/productService.js";
import ticketService from "../services/ticketService.js";
import userService from '../services/userService.js';


const router = Router();

router.get('/', cartController.getAllCarts);

router.get('/:cid', passportCall('jwt'), cartController.getCartById);

router.post('/', cartController.createCart);

router.post('/:cid/product/:pid', passportCall('jwt'), isUser, cartController.addProductByID);

// router.post('/:cid/purchase', passportCall('jwt'), cartController.purchase);

router.put('/:cid', cartController.updateCart);

router.put('/:cid/products/:pid', cartController.updateProductQuantity);

router.delete('/:cid', cartController.deleteCart);

router.delete('/:cid/products/:pid', passportCall('jwt'), cartController.removeProductByID);

// router.post("/:cid/purchase", async (req, res) => {
//   try {
//     const results = req.params.cid;

//     res.send({
//         status: 'success',
//         payload: results
//     });
//   } catch (error) {
//     res.status(400).send({
//         status: 'error',
//         message: error.message
//     });
//   }
//   });
  
//   router.get("/:cid/purchase", async (req, res) => {
//     try {
//       // const purchaser = req.user.email;
//       const cart = await cartRepository.getProductsFromCart(req.params.cid);
      
//       let amount = 0;
//       for (const cartProduct of cart.products) {
//           amount += cartProduct.product.price * cartProduct.quantity;
//       }
      
//       const ticket = await ticketController.createTicket(purchaser, amount, cart.id);
//       const notProcessed = await cartRepository.getStockfromProducts(req.params.cid);

//       req.params.cid = ticket;

//       res.render('ticketView', { title: 'Ticket', ticket: ticket, notProcessed: notProcessed });
//     } catch (error) {
//       res.status(400).send({
//           status: 'error',
//           message: error.message
//       });
//     }
//   });

router.post('/:cid/purchase', async (req, res) => {
  const cartId = req.params.cid;
  const userId = req.session.user._id;

  try {
    console.log(`Iniciando compra para el carrito con ID: ${cartId}`);
    console.log(`ID de usuario desde la sesión: ${userId}`);

    const user = await userService.getUser(userId);
    console.log('Usuario obtenido:', user);

    // Verificar que el carrito pertenece al usuario
    if (user.cart.toString() !== cartId) {
      console.log('El carrito no pertenece al usuario.');
      return res.status(401).send({status: 'error', message: 'No tienes permisos para comprar este carrito'});
    }

    // Obtener el carrito por ID
    const cart = await cartService.getCartById(cartId);
    console.log('Carrito obtenido:', cart);

    // Verificar si el carrito tiene productos
    if (!cart.products.length) {
      console.log('El carrito no tiene productos.');
      return res.status(400).send({status: 'error', message: 'No hay productos en el carrito'});
    }

    // Verificar stock de los productos y eliminar los que no tienen suficiente stock
    let itemsRemoved = [];
    for (let item of cart.products) {
      const product = await productService.getProductById(item.product._id);
      console.log(`Producto obtenido para verificación de stock: ${product.title}, stock actual: ${product.stock}, cantidad en carrito: ${item.quantity}`);
      
      if (product.stock < item.quantity) {
        itemsRemoved.push(item);
        await cartService.deleteProductFromCart(cartId, item.product._id);
        console.log(`Producto ${product.title} eliminado del carrito por falta de stock.`);
      }
    }

    // Obtener el carrito actualizado
    const currentCart = await cartService.getCartById(cartId);
    console.log('Carrito actualizado:', currentCart);

    // Calcular el monto total del carrito actual
    let totalAmount = 0;
    for (let item of currentCart.products) {
      totalAmount += item.product.price * item.quantity;
    }
    console.log('Monto total calculado del carrito:', totalAmount);

    // Actualizar el stock de los productos
    for (let item of currentCart.products) {
      await productService.updateProduct(item.product._id, { stock: item.product.stock - item.quantity });
      console.log(`Stock actualizado para el producto: ${item.product.title}`);
    }

    // Autogenerar código y autoincrementar
    let code = 0;
    let tickets = await ticketService.getTickets();
    if (tickets.length) {
      code = +tickets[tickets.length - 1].code + 1;
    }
    console.log('Código de ticket generado:', code);

    // Generar ticket con el carrito actual y eliminar todos los productos del carrito
    const ticket = await ticketService.createTicket({ code, amount: totalAmount, products: currentCart.products, purchaser: userId });
    console.log('Ticket generado:', ticket);

    await cartService.deleteAllProductsFromCart(cartId);
    console.log('Todos los productos eliminados del carrito después de la compra.');

    // Si había productos sin stock, añadirlos de nuevo al carrito después de la compra
    // if (itemsRemoved.length > 0) {
    //   for (let item of itemsRemoved) {
    //     await cartService.addProductToCart(cartId, item.product._id, item.quantity);
    //     console.log(`Producto ${item.product.title} añadido nuevamente al carrito después de la compra.`);
    //   }
    // }

    // Mostrar el ticket y los productos sin stock
    res.status(200).send({status: 'success', message: 'Compra realizada', ticket, itemsRemoved});
  } catch (error) {
    console.error('Error durante la compra:', error);
    res.status(400).send({status: 'error', message: error.message, error: error});
  }
});

export default router;