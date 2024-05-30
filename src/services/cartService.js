// src/services/cartService.js
import CartRepository from '../dao/repositories/cartRepository.js';

const cartRepository = new CartRepository();

const getAllCarts = async () => {
  try {
    return await cartRepository.getAllCarts();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCartById = async (id) => {
  try {
    return await cartRepository.getCartById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createCart = async () => {
  try {
    return await cartRepository.createCart();
  } catch (error) {
    throw new Error(error.message);
  }
};

const addProductByID = async (cartId, productId) => {
  try {
    return await cartRepository.addProductByID(cartId, productId);
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
  updateCart,
  updateProductQuantity,
  deleteCart
};
