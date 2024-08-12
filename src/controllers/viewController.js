// src/controllers/viewController.js
import productService from '../services/productService.js';
import cartService from '../services/cartService.js'
import { generateProducts } from "../utils/mockUtil.js";
import ticketService from '../services/ticketService.js';
import mongoose from 'mongoose';

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

const getProducts = async (req, res) => {
    try {
        const user = req.session.user;
        const { limit = 4, page = 1, category, availability, sort = null } = req.query;

        let query = {};
        if (category) query.category = category;
        if (availability !== undefined) query.status = availability === "true";

        const result = await productService.getAllProducts(limit, page, query, sort);
        const isValid = !(page <= 0 || page > result.totalPages);

        res.render("products", {
            style: "index.css",
            status: "success",
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevPage ? `/products?page=${result.prevPage}` : null,
            nextLink: result.nextPage ? `/products?page=${result.nextPage}` : null,
            isValid: isValid,
            user: user
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener los productos:', error);
    }
};

const getRealTimeProducts = async (req, res) => {
    try {
        const user = req.session.user;
        const { limit = 20, page = 1, category, availability, sort = null } = req.query;

        const products = await productService.getAllProducts(limit, page, { category, availability }, sort);
        
        res.render('realTimeProducts', {
            title: 'Productos',
            style: 'index.css',
            products: products.docs,
            user: user
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener los productos en tiempo real:', error);
    }
};

const getPremiumProducts = async (req, res) => {
    try {
        const userId = req.session.user._id;

        // Verifica si userId está presente y es un ObjectId válido
        console.log('ID del usuario en sesión:', userId);
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.error('ID del usuario no es válido:', userId);
            return res.status(400).send('ID de usuario no válido');
        }

        // Obtén los productos del propietario
        const products = await productService.getProductsByOwner(userId);

        res.render('premiumUserProducts', { 
            products,
            style: "index.css"
         });
    } catch (error) {
        console.error('Error en el controlador al obtener los productos en tiempo real:', error);
        res.status(500).send('Error al obtener productos del propietario');
    }
};

const chat = (req, res) => {
    const user = req.session.user;
    res.render("chat", {
        title: "Chat usuarios",
        style: "index.css",
        user: user
    });
};

const login = (req, res) => {
    res.render("login", {
        title: "Login",
        style: "index.css",
        failLogin: req.session.failLogin ?? false
    });
};

const logout = (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al cerrar la sesión'
            });
        }
        res.redirect("/login");
    });
};

const register = (req, res) => {
    res.render("register", {
        title: "Register",
        style: "index.css",
        failRegister: req.session.failRegister ?? false
    });
};
const getCartView = async (req, res) => {
    try {
        const cartId = req.session.user.cartId || req.session.user.cart;
        console.log(cartId)
        const cart = await cartService.getCartById(cartId);
        if (!cart) {
            return res.status(404).send({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.render('cart', {
            cart: cart,
            user: req.session.user,
            style: 'index.css'
        });
    } catch (error) {
        req.logger.warning('Error al obtener la vista del carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};
const getAllCarts = async (req, res) => {
    try {
        const carts = await cartService.getAllCarts();
        res.render('allCarts', { carts, user: req.user, style: 'index.css' });
    } catch (error) {
        req.logger.warning('Error al obtener los carritos:', error);
        res.status(400).send({ status: 'error', message: error.message });
    }
};
const mockProducts = (_req, res) => {
    let products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProducts());
    }
    res.render('mocking', { title: 'Mocking Products', products, style: 'index.css'});
};

const forgotPassword = (req, res) => {
    res.render('request-reset', {
        title: "Olvide Contraseña",
        style: "index.css"
    });
};

const getResetPassword = (req, res) => {
    const { token } = req.params;
    res.render('reset-password', {
        token,
        title: "Reset Password",
        style: "index.css"
    });
};

const adminDashboard = (req, res) => {
    res.render('adminDashboard', {
        title: 'Admin Dashboard',
        style: 'index.css'
    });
};
const userDashboard = (req, res) => {
    const user = req.session.user;
    console.log('User data being passed to view:', user); // Verificación de los datos de usuario

    res.render('userDashboard', {
        title: 'User Dashboard',
        style: 'index.css',
        user: user
    });
};
const premiumDashboard = (req, res) => {
    const user = req.session.user;
    console.log('User data being passed to view:', user); // Verificación de los datos de usuario

    res.render('premiumUserDashboard', {
        title: 'Premium User Dashboard',
        style: 'index.css',
        user: user
    });
};
const getTicketView = async (req, res) => {
    try {
        const ticketId = req.params.tid;
        const ticket = await ticketService.getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).send({ status: 'error', message: 'Ticket no encontrado' });
        }

        const itemsRemoved = req.session.itemsRemoved || [];
        res.render('tickets', { ticket, itemsRemoved, user: req.user, style: 'index.css' });

    } catch (error) {
        req.logger.warning('Error al obtener la vista del ticket:', error);
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export default {
    isAuthenticated,
    getProducts,
    getRealTimeProducts,
    getPremiumProducts,
    chat,
    login,
    logout,
    register,
    getCartView,
    getAllCarts,
    mockProducts,
    forgotPassword,
    getResetPassword,
    adminDashboard,
    userDashboard,
    premiumDashboard,
    getTicketView
};
