
// src/repositories/productRepository.js
import productModel from '../models/productModel.js';

class ProductRepository {
  async getAllProducts(limit, page, query = {}, sort) {
    try {
      let filter = {};

      if (query.category) {
        filter.category = query.category;
      }

      if (query.availability) {
        filter.status = query.availability === 'true';
      }

      const result = await productModel.paginate(filter, { limit, page, lean: true, sort });
      return result;
    } catch (error) {
      throw new Error('Error al obtener productos');
    }
  }

  async getProductById(pid) {
    try {
      const product = await productModel.findOne({ _id: pid });
      if (!product) throw new Error(`El producto ${pid} no existe`);
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createProduct(product) {
    try {
      const result = await productModel.create(product);
      return result;
    } catch (error) {
      throw new Error('Error al crear el producto');
    }
  }

  async updateProduct(pid, productUpdate) {
    try {
      const result = await productModel.updateOne({ _id: pid }, productUpdate);
      return result;
    } catch (error) {
      throw new Error('Error al actualizar el producto');
    }
  }

  async deleteProduct(pid) {
    try {
      const result = await productModel.deleteOne({ _id: pid });
      if (result.deletedCount === 0) throw new Error(`El producto ${pid} no existe!`);
      return result;
    } catch (error) {
      throw new Error(`Error al eliminar el producto ${pid}`);
    }
  }
}

export default ProductRepository;