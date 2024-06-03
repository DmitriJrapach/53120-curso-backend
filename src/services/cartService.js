// src/services/cartService.js
import CartRepository from '../dao/repositories/cartRepository.js';
import mongoose from 'mongoose';
import cartModel from '../dao/models/cartModel.js';

const cartRepository = new CartRepository();

const getAllCarts = async () => {
  try {
    return await cartRepository.getAllCarts();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCartById = async (cid) => {
  try {
      const cart = await cartRepository.getCartById(cid);
      if (!cart) {
          throw new Error('Carrito no encontrado');
      }
      return cart;
  } catch (error) {
      throw new Error(error.message);
  }
};

const createCart = async () => {
  try {
      const newCart = await cartRepository.createCart();
      console.log('Carrito creado en cartService.createCart:', newCart);
      return newCart;
  } catch (error) {
      console.error('Error en cartService.createCart:', error.message);
      console.error('Stack trace:', error.stack);
      throw new Error('Error al crear el carrito');
  }
};

const addProductByID = async (cartId, productId) => {
  try {
    return await cartRepository.addProductByID(cartId, productId);
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeProductByID = async (cartId, productObjectId) => {
  try {
    console.log(`Removing product ID: ${productObjectId} from cart ID: ${cartId}`);
    const cart = await cartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // Convertir productObjectId a ObjectId
    const productObjectIdConverted = new mongoose.Types.ObjectId(productObjectId);

    // Eliminar el producto del array de productos del carrito
    cart.products = cart.products.filter(p => p.product.toString() !== productObjectIdConverted.toString());

    // Guardar los cambios
    await cartModel.findByIdAndUpdate(cartId, { products: cart.products });

    return cart;
  } catch (error) {
    console.error('Error en el servicio al eliminar el producto del carrito:', error);
    throw new Error(error.message);
  }
};



const getCartView = async (req, res) => {
  try {
      const cart = await cartService.getCartById(req.params.cid);
      res.render('cart', {
          cart: cart,
          user: req.session.user,
          style: 'main.css'
      });
  } catch (error) {
      res.status(400).send({
          status: 'error',
          message: error.message
      });
  }
};

const checkout = async (cartId) => {
  try {
      const cart = await cartRepository.getCartById(cartId);
      if (!cart) {
          throw new Error('Carrito no encontrado');
      }
      // Aquí podrías añadir la lógica para procesar el pago y vaciar el carrito
      cart.products = [];
      await cart.save();
      return cart;
  } catch (error) {
      throw new Error(error.message);
  }
};

const updateCart = async (cartId, products) => {
  try {
    return await cartRepository.updateCart(cartId, products);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    return await cartRepository.updateProductQuantity(cartId, productId, quantity);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCart = async (cartId) => {
  try {
    return await cartRepository.deleteCart(cartId);
  } catch (error) {
    throw new Error(error.message);
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
  checkout
};
