import cartService from '../services/cartService.js';

const getAllCarts = async (req, res) => {
    try {
        const result = await cartService.getAllCarts();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const getCartById = async (req, res) => {
    try {
        const result = await cartService.getCartById(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const createCart = async (req, res) => {
    try {
        const result = await cartService.createCart();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const addProductByID = async (req, res) => {
    try {
        const result = await cartService.addProductByID(req.params.cid, req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const removeProductByID = async (req, res) => {
    try {
        const result = await cartService.removeProductByID(req.params.cid, req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const result = await cartService.updateCart(req.params.cid, req.body.products);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const result = await cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const checkout = async (req, res) => {
    try {
        const cart = await cartService.checkout(req.params.cid);
        res.send({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const deleteCart = async (req, res) => {
    try {
        const result = await cartService.deleteCart(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const getCartView = async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid);
        if (!cart) {
            console.log('Carrito no encontrado');
            return res.status(404).send({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }
        console.log('Carrito:', cart);
        console.log('Usuario:', req.user);

        res.render('cart', {
            cart: cart,
            user: req.user,
            style: 'main.css'
        });
    } catch (error) {
        console.error('Error al obtener la vista del carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};


export default {
    getAllCarts,
    getCartById,
    createCart,
    addProductByID,
    removeProductByID,
    updateCart,
    updateProductQuantity,
    deleteCart,
    checkout,
    getCartView
};
