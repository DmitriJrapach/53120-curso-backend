// src/controllers/viewController.js
import productService from '../services/productService.js';
import cartService from '../services/cartService.js'

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
        console.error(error);
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
        console.error(error);
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
        const cart = await cartService.getCartById(req.params.cid);
        if (!cart) {
            console.log('Carrito no encontrado');
            return res.status(404).send({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }
        // console.log('Carrito:', cart);
        // console.log('Usuario:', user);

        res.render('cart', {
            cart: cart,
            user: user,
            style: 'index.css'
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
    isAuthenticated,
    getProducts,
    getRealTimeProducts,
    chat,
    login,
    logout,
    register,
    getCartView
};
