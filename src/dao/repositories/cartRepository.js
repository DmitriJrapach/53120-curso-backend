// src/repositories/cartRepository.js
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

class CartRepository {
  async getAllCarts() {
    try {
      return await cartModel.find();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al buscar los productos");
    }
  }

  async getCartById(cid) {
    try {
        const cart = await cartModel.findById(cid).populate('products.product').lean();
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener el carrito");
    }
  }

  async createCart() {
    try {
        const newCart = await cartModel.create({});
        console.log('Carrito creado en CartRepository.createCart:', newCart);
        return newCart;
    } catch (error) {
        console.error('Error en CartRepository.createCart:', error.message);
        console.error('Stack trace:', error.stack);
        throw new Error('Error al crear el carrito');
    }
}

  async updateCart(cartId, products) {
    try {
      // Verificar si el carrito existe
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error(`El carrito ${cartId} no existe`);
      }

      // Actualizar productos en el carrito
      cart.products = products;

      // Guardar los cambios en la base de datos
      await cart.save();
      
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      // Verificar si el carrito existe
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error(`El carrito ${cartId} no existe`);
      }

      // Verificar si el producto está en el carrito
      const productIndex = cart.products.findIndex(product => product.product.toString() === productId);
      if (productIndex === -1) {
        throw new Error(`El producto ${productId} no está en el carrito ${cartId}`);
      }

      // Actualizar la cantidad del producto
      cart.products[productIndex].quantity = quantity;

      // Guardar los cambios en la base de datos
      await cart.save();
      
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
    }
  }

  async addProductByID(cartId, productId) {
    try {
      // Verifica si el producto existe
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error(`El producto ${productId} no existe`);
      }
  
      // Busca el carrito por su ID
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error(`El carrito ${cartId} no existe`);
      }
  
      // Crea un nuevo objeto de producto en el carrito
      const newProduct = {
        product: productId,
        quantity: 1
      };

      console.log('Nuevo producto a agregar al carrito:', newProduct);
  
      // Agrega el nuevo producto al array de productos del carrito
      cart.products.push(newProduct);
  
      // Guarda los cambios en la base de datos
      await cart.save();
  
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }
  
  

  async removeProductByID(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteCart(cartId) {
    try {
      // Buscar el carrito por su ID
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error(`El carrito ${cartId} no existe`);
      }

      // Eliminar el carrito de la base de datos
      await cartModel.findByIdAndDelete(cartId);

      return { message: `Carrito ${cartId} eliminado exitosamente` };
    } catch (error) {
      throw new Error(`Error al eliminar el carrito: ${error.message}`);
    }
  }
}

export default CartRepository;
