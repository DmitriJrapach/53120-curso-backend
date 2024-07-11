// src/dao/productFactory.js
import ProductRepository from './repositories/productRepository.js';
import ProductFS from './fs/productFS.js';

class ProductFactory {
  static create(persistenceType) {
    switch (persistenceType) {
      case 'MONGO':
        return new ProductRepository();
      case 'FS':
        return new ProductFS();
      default:
        throw new Error('Tipo de persistencia no soportado');
    }
  }
}

export default ProductFactory;
