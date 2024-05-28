// src/services/productService.js
import { productManagerDB } from '../dao/productManagerDB.js';

const productManager = new productManagerDB();

const getAllProducts = async (limit = 10, page = 1, query = {}, sort = {}) => {
    try {
      return await productManager.getAllProducts(limit, page, query, sort);
    } catch (error) {
      throw new Error(error.message);
    }
  };

const getProductByID = async (pid) => {
    try {
        return await productManager.getProductByID(pid);
    } catch (error) {
        throw new Error(error.message);
    }
};

const createProduct = async (productData) => {
    try {
        return await productManager.createProduct(productData);
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateProduct = async (pid, productData) => {
    try {
        return await productManager.updateProduct(pid, productData);
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteProduct = async (pid) => {
    try {
        return await productManager.deleteProduct(pid);
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getAllProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
};
