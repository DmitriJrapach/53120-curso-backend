import ProductRepository from './repositories/productRepository.js';

class ProductManagerDB {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(limit, page, query = {}, sort) {
    return this.productRepository.getAllProducts(limit, page, query, sort);
  }

  async getProductById(pid) {
    return this.productRepository.getProductById(pid);
  }

  async createProduct(product) {
    return this.productRepository.createProduct(product);
  }

  async updateProduct(pid, productUpdate) {
    return this.productRepository.updateProduct(pid, productUpdate);
  }

  async deleteProduct(pid) {
    return this.productRepository.deleteProduct(pid);
  }
}

export default ProductManagerDB;
