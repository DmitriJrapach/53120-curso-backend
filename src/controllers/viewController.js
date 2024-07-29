// src/controllers/viewController.js
import productService from '../services/productService.js';
import cartService from '../services/cartService.js'
import { generateProducts } from "../utils/mockUtil.js";

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
        const user = req.session.user;

        // Usa cartId directamente ya que hemos normalizado la sesión
        const cartId = user.cartId;

        if (!cartId) {
            console.log('No se encontró un carrito asociado al usuario');
            return res.status(404).send({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        // Obtén el carrito usando el cartId
        const cart = await cartService.getCartById(cartId);

        if (!cart) {
            console.log('Carrito no encontrado');
            return res.status(404).send({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        // Renderiza la vista del carrito con los datos obtenidos
        res.render('cart', {
            cart: cart,
            user: user,
            style: 'index.css'
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener vista del carrito:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
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

export default {
    isAuthenticated,
    getProducts,
    getRealTimeProducts,
    chat,
    login,
    logout,
    register,
    getCartView,
    mockProducts,
    forgotPassword,
    getResetPassword,
    adminDashboard,
    userDashboard
};
