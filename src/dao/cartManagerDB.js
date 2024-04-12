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

    async getProductsFromCartByID(cid) {
        try {
            // Busca el carrito en la base de datos por su ID
            const cart = await cartModel.findOne({ _id: cid });

            // Si se encuentra un carrito con el ID dado, devuelve los productos del carrito
            if (cart) {
                return cart.products;
            }

            // Si no se encuentra ningún carrito con el ID dado, lanza un error
            throw new Error(`El carrito ${cid} no existe!`);
        } catch (error) {
            // Captura cualquier error y lo maneja
            throw new Error(`Error al obtener productos del carrito: ${error.message}`);
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
}

export { cartManagerDB };