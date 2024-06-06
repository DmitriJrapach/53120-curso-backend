// src/services/cartService.js
import CartRepository from '../dao/repositories/cartRepository.js';
import cartModel from '../dao/models/cartModel.js';
import cartDTO from  '../dto/cartDTO.js';


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

const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const cart = await cartRepository.addProductToCart(cartId, productId, quantity);
    if (!cart) {
      throw new Error('Error adding product to cart');
    }
    return new cartDTO(cart);
  } catch (error) {
    throw error;
  }
}
const removeProductByID = async (cartId, productObjectId) => {
  try {
    console.log(`Removing product ID: ${productObjectId} from cart ID: ${cartId}`);
    const result = await cartRepository.removeProductByID(cartId, productObjectId);
    return result;
  } catch (error) {
    console.error('Error en el servicio al eliminar el producto del carrito:', error);
    throw new Error(error.message);
  }
};

const deleteProductFromCart = async (cartId, productId) => {
  try {
    const cart = await cartModel.findOneAndUpdate(
      {_id: cartId},
      { $pull: { products: {product: productId}}},
    )
    return cart;
  } catch (error) {
    throw error
  }
}

const deleteAllProductsFromCart = async (cartId) => {
  try {
    const cart = cartRepository.deleteAllProductsFromCart(cartId);
    if (!cart) {
      throw new Error('Error deleting products from cart');
    }
    return new cartDTO(cart);
  } catch (error) {
    throw error;
  }
}

const getCartView = async (req, res) => {
  try {
      const cart = await cartRepository.getCartById(req.params.cid);
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

const getStockfromProducts = async(cart) => {
  return await cartRepository.getStockfromProducts(cart);
}

export default {
  getAllCarts,
  getCartById,
  createCart,
  addProductByID,
  addProductToCart,
  removeProductByID,
  deleteProductFromCart,
  deleteAllProductsFromCart,
  updateCart,
  updateProductQuantity,
  deleteCart,
  getCartView,
  getStockfromProducts
};
