// src/services/productService.js
import ProductRepository from '../dao/repositories/productRepository.js';
import mongoose from 'mongoose';

const productRepository = new ProductRepository();

//Patron factory con fs
// import ProductRepository from '../dao/repositories/productRepository.js';

// const productRepository = new ProductRepository();

const getAllProducts = async (limit = 10, page = 1, query = {}, sort = {}) => {
  try {
    return await productRepository.getAllProducts(limit, page, query, sort);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductById = async (pid) => {
  try {
    return await productRepository.getProductById(pid);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createProduct = async (productData, user) => {
  try {
    return await productRepository.createProduct(productData, user);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProduct = async (pid, productData) => {
  try {
    return await productRepository.updateProduct(pid, productData);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (pid) => {
  try {
    return await productRepository.deleteProduct(pid);
  } catch (error) {
    throw new Error(error.message);
  }
};
const getProductsByOwner = async (owner) => {
  try {
    return await productRepository.getProductsByOwner(owner);
  } catch (error) {
    console.error('Error in getProductsByOwner:', error);
    throw new Error('Error al obtener productos del propietario');
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByOwner
};
