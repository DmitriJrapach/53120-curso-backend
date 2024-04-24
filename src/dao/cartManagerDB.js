import productModel from "./models/productModel.js";
import cartModel from "./models/cartModel.js";


class cartManagerDB {

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
                console.error('Carrito no encontrado');
                return;
            }
            return cart;
        } catch (error) {
            console.error(error);
        }
    }

    async createCart() {
        try {
            const newCart = await cartModel.create({}); // Puedes pasar un objeto con los datos del carrito si es necesario
            console.log("carrito creado", newCart);
            return newCart;
        } catch (error) {
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

    async addProductByID(cid, pid) {
        try {
            // Verifica si el producto existe
            const product = await productModel.findById(pid);
            if (!product) {
                throw new Error(`El producto ${pid} no existe`);
            }

            // Busca el carrito por su ID
            const cart = await cartModel.findOne({ _id: cid });

            // Si se encuentra el carrito, actualiza los productos
            if (cart) {
                let exist = false;
                // Itera sobre los productos del carrito
                cart.products.forEach(cartProduct => {
                    // Si el producto ya existe en el carrito, aumenta su cantidad
                    if (cartProduct.product.toString() === pid) {
                        exist = true;
                        cartProduct.quantity++;
                    }
                });

                // Si el producto no existe en el carrito, agrégalo con cantidad 1
                if (!exist) {
                    cart.products.push({
                        product: pid,
                        quantity: 1
                    });
                }

                // Guarda los cambios en la base de datos
                await cart.save();
                return cart;
            } else {
                // Si no se encuentra el carrito, lanza un error
                throw new Error(`El carrito ${cid} no existe`);
            }
        } catch (error) {
            // Captura cualquier error y lo maneja
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
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

export { cartManagerDB };