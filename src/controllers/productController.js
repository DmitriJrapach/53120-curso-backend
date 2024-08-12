// src/controllers/productController.js
import productService from '../services/productService.js';
import userService from '../services/userService.js';
import sendMail from '../utils/sendMail.js';

const getAllProducts = async (req, res) => {
    try {
        const user = req.session.user;
        const { limit, page, ...query } = req.query;
        const products = await productService.getAllProducts(limit, page, query);

        res.render('products', {
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

const getProductById = async (req, res) => {
    try {
        const result = await productService.getProductById(req.params.pid);
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
  // Agregar el owner basado en el rol del usuario
  if (req.session.user.role === 'premium') {
    req.body.owner = req.session.user._id; // Asignar el ID del usuario premium como owner
  } else {
    req.body.owner = 'admin'; // Establecer owner como admin por defecto
  }

  try {
    const user = req.session.user; // Obtener el usuario de la sesión
    const result = await productService.createProduct(req.body, user);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    req.logger.warning('Error en el controlador al crear el producto:', error);
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
        const { pid } = req.params;
        const { role } = req.session.user || {}; // Obtener el rol del usuario desde la sesión

        // Obtener el producto y el propietario
        const product = await productService.getProductById(pid);

        if (!product) {
            return res.status(404).send({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Obtener el propietario del producto
        const owner = await userService.getUser(product.owner);

        // Eliminar el producto
        const result = await productService.deleteProduct(pid);

        // Verificar si el producto fue eliminado
        if (!result) {
            return res.status(404).send({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Enviar correo al propietario si el usuario es admin
        if (role === 'admin' && owner.email) {
            const subject = 'Product Deleted';
            const text = `Product with ID ${pid} has been deleted by an admin.`;

            try {
                await sendMail(owner.email, subject, text);
                res.send({
                    status: 'success',
                    payload: result
                });
            } catch (mailError) {
                req.logger.warning('Error sending email:', mailError);
                res.status(500).send({
                    status: 'error',
                    message: 'Error sending email'
                });
            }
        } else {
            res.send({
                status: 'success',
                payload: result
            });
        }
    } catch (error) {
        req.logger.warning('Error in the controller when deleting the product:', error);
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
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductToCart
};
