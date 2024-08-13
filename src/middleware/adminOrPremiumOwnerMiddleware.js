// src/middlewares/authMiddleware.js
import productModel from '../dao/models/productModel.js';

const isAdminOrPremiumOrOwner = async (req, res, next) => {
  
  if (!req.session.user) {
    return res.status(401).send({ status: 'error', message: 'Unauthorized' });
  }

  // Verificación para la creación de productos
  if (req.method === 'POST') {
    if (req.session.user.role === 'admin' || req.session.user.role === 'premium') {
      return next();
    } else {
      return res.status(403).send({ status: 'error', message: 'No tienes permisos para crear un producto' });
    }
  }

  // Para PUT y DELETE, verificar si el usuario tiene permiso
  const productId = req.params.pid;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
    }

    // Si el producto no tiene owner, se considera que es administrado por el 'admin'
    const productOwner = product.owner ? product.owner.toString() : 'admin';

    // Permitir si el usuario es admin o si es el dueño del producto
    if (req.session.user.role === 'admin' || productOwner === req.session.user._id.toString()) {
      return next();
    } else {
      return res.status(403).send({ status: 'error', message: 'No tienes permisos para realizar esta acción' });
    }
  } catch (error) {
    console.error('Error al buscar el producto:', error);
    return res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
  }
};

export default isAdminOrPremiumOrOwner;
