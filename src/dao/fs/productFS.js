// src/dao/fs/productFS.js
import fs from 'fs/promises';
import path from 'path';
import __dirname from '../../utils/constantsUtil.js';

const dataFilePath = path.join(__dirname, '../../data/products.json');

class ProductFS {
  constructor() {
    this.initializeDataFile();
  }

  async initializeDataFile() {
    try {
      await fs.access(dataFilePath);
    } catch {
      await fs.writeFile(dataFilePath, '[]');
    }
  }

  async getAllProducts(limit, page, query = {}, sort = {}) {
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      let products = JSON.parse(data);

      // Apply filters
      if (query.category) {
        products = products.filter(product => product.category === query.category);
      }

      if (query.availability) {
        products = products.filter(product => product.status === (query.availability === 'true'));
      }

      // Apply sorting
      if (sort && Object.keys(sort).length > 0) {
        const [sortField, sortOrder] = Object.entries(sort)[0];
        products.sort((a, b) => (a[sortField] > b[sortField] ? sortOrder : -sortOrder));
      }

      // Pagination
      const totalProducts = products.length;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedProducts = products.slice(startIndex, endIndex);

      return {
        docs: paginatedProducts,
        totalDocs: totalProducts,
        limit,
        page,
        totalPages: Math.ceil(totalProducts / limit),
        hasPrevPage: page > 1,
        hasNextPage: endIndex < totalProducts,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: endIndex < totalProducts ? page + 1 : null,
      };
    } catch (error) {
      throw new Error('Error al obtener productos desde el archivo');
    }
  }

  async getProductById(pid) {
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      const products = JSON.parse(data);
      const product = products.find(p => p._id === pid);
      if (!product) throw new Error(`El producto ${pid} no existe`);
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createProduct(product) {
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      const products = JSON.parse(data);
      product._id = new Date().getTime().toString(); // Generar ID único
      products.push(product);
      await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
      return product;
    } catch (error) {
      throw new Error('Error al crear producto en el archivo');
    }
  }

  async updateProduct(pid, productUpdate) {
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      let products = JSON.parse(data);
      const index = products.findIndex(p => p._id === pid);
      if (index === -1) throw new Error(`El producto ${pid} no existe`);
      products[index] = { ...products[index], ...productUpdate };
      await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      throw new Error('Error al actualizar producto en el archivo');
    }
  }

  async deleteProduct(pid) {
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      let products = JSON.parse(data);
      const index = products.findIndex(p => p._id === pid);
      if (index === -1) throw new Error(`El producto ${pid} no existe`);
      const deletedProduct = products.splice(index, 1);
      await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
      return deletedProduct;
    } catch (error) {
      throw new Error('Error al eliminar producto en el archivo');
    }
  }
}

export default ProductFS;
