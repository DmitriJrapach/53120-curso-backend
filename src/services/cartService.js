// src/services/cartService.js
import { cartManagerDB } from '../dao/cartManagerDB.js';

const cartManager = new cartManagerDB();

const getAllCarts = async () => {
    try {
        return await cartManager.getAllCarts();
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCartById = async (id) => {
    try {
        return await cartManager.getCartById(id);
    } catch (error) {
        throw new Error(error.message);
    }
};

const createCart = async () => {
    try {
        return await cartManager.createCart();
    } catch (error) {
        throw new Error(error.message);
    }
};

const addProductByID = async (cartId, productId) => {
    try {
        return await cartManager.addProductByID(cartId, productId);
    } catch (error) {
        throw new Error(error.message);
    }
};

const removeProductByID = async (cartId, productId) => {
    try {
        return await cartManager.removeProductByID(cartId, productId);
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateCart = async (cartId, products) => {
    try {
        return await cartManager.updateCart(cartId, products);
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateProductQuantity = async (cartId, productId, quantity) => {
    try {
        return await cartManager.updateProductQuantity(cartId, productId, quantity);
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteCart = async (cartId) => {
    try {
        return await cartManager.deleteCart(cartId);
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
    deleteCart
};
