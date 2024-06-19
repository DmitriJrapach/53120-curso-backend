// src/controllers/productController.js
import productService from '../services/productService.js';

const getAllProducts = async (req, res) => {
    try {
        const user = req.session.user;
        const { limit, page, ...query } = req.query;
        const products = await productService.getAllProducts(limit, page, query);

        res.render('viewProduct', {
            products: products.docs,
            user: user,
            isValid: products.docs.length > 0,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener los productos:', error);
        res.status(500).send({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

const getProductByID = async (req, res) => {
    try {
        const result = await productService.getProductByID(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener el producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const createProduct = async (req, res) => {

    console.log('Request body in controller before processing:', req.body);
    console.log('Request files in controller before processing:', req.files);
    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await productService.createProduct(req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al crear el producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await productService.updateProduct(req.params.pid, req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al eactulalizar el producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al eliminar el producto:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const addProductToCart = async (req, res) => {
    try {
        await cartService.addProductByID(req.params.cid, req.params.pid);
        res.redirect(`/api/carts/${req.params.cid}/view`);
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

export default {
    getAllProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductToCart
};
