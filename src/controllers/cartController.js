import cartService from '../services/cartService.js';
import productService from "../services/productService.js";
import ticketService from "../services/ticketService.js";
import userService from '../services/userService.js';


const getAllCarts = async (req, res) => {
    try {
        const result = await cartService.getAllCarts();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener todos los carritos:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const getCartById = async (req, res) => {
    try {
        const result = await cartService.getCartById(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener el carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const createCart = async (req, res) => {
    try {
        const result = await cartService.createCart();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al crear el carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const addProductByID = async (req, res) => {
    try {
        const result = await cartService.addProductByID(req.params.cid, req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning('Error en el controlador al agregar el producto del carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const removeProductByID = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartService.removeProductByID(cid, pid);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    req.logger.warning('Error en el controlador al eliminar el producto del carrito:', error);
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
};

const updateCart = async (req, res) => {
    try {
        const result = await cartService.updateCart(req.params.cid, req.body.products);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al actualizar el carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const result = await cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al actualizar la cantidad de productos', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const deleteCart = async (req, res) => {
    try {
        const result = await cartService.deleteCart(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al eliminar el carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const getCartView = async (req, res) => {
    try {
        const cartId = req.session.user.cartId || req.session.user.cart;
        console.log(cartId)
        const cart = await cartService.getCartById(cartId);
        if (!cart) {
            return res.status(404).send({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.render('cart', {
            cart: cart,
            user: req.user,
            style: 'main.css'
        });
    } catch (error) {
        req.logger.warning('Error al obtener la vista del carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const purchaseCart = async (req, res) => {
  const cartId = req.params.cid;
  const userId = req.session.user._id;

  try {

    const user = await userService.getUser(userId);

    // Verificar que el carrito pertenece al usuario
    if (user.cart.toString() !== cartId) {
      return res.status(401).send({ status: 'error', message: 'No tienes permisos para comprar este carrito' });
    }

    // Obtener el carrito por ID
    const cart = await cartService.getCartById(cartId);

    // Verificar si el carrito tiene productos
    if (!cart.products.length) {
      return res.status(400).send({ status: 'error', message: 'No hay productos en el carrito' });
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
    let tickets = await ticketService.getAllTickets();
    if (tickets.length) {
      code = +tickets[tickets.length - 1].code + 1;
    }
    console.log('Código de ticket generado:', code);

    // Generar ticket con el carrito actual y eliminar todos los productos del carrito
    const ticket = await ticketService.createTicket({ code, amount: totalAmount, products: currentCart.products, purchaser: userId });
    console.log('Ticket generado:', ticket);

    await cartService.deleteAllProductsFromCart(cartId);
    console.log('Todos los productos eliminados del carrito después de la compra.');

    // Mostrar el ticket y los productos sin stock
    res.status(200).send({ status: 'success', message: 'Compra realizada', ticket, itemsRemoved });
  } catch (error) {
    req.logger.warning('Error durante la compra:', error);
    res.status(400).send({ status: 'error', message: error.message, error: error });
  }
};

export default {
    getAllCarts,
    getCartById,
    createCart,
    addProductByID,
    removeProductByID,
    updateCart,
    updateProductQuantity,
    deleteCart,
    getCartView,
    purchaseCart
};
