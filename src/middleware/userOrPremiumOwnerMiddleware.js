// src/middleware/userMiddleware.js
import productModel from '../dao/models/productModel.js';

const isUserOrPremiumOwner = async (req, res, next) => {
  console.log('User session in isUserOrPremium:', req.session.user);

  // Verificar si el usuario está autenticado
  if (!req.session.user) {
    return res.status(401).send({ status: 'error', message: 'Unauthorized' });
  }

  // Permitir si el usuario es user o premium (no admin)
  if (req.session.user.role === 'user') {
    return next();
  }

  if (req.session.user.role === 'premium') {
    const productId = req.params.pid;
    try {
      const product = await productModel.findById(productId);

      // Verificar si el producto existe
      if (!product) {
        return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
      }

      // Verificar si el producto tiene un owner y si es el usuario premium actual
      if (product.owner && product.owner.toString() === req.session.user._id.toString()) {
        return res.status(403).send({ status: 'error', message: 'No puedes agregar tu propio producto al carrito' });
      }

      return next();
    } catch (error) {
      console.error('Error al verificar el producto:', error);
      return res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
  }

  // Bloquear el acceso si el usuario es admin o cualquier otro rol
  return res.status(403).send({ status: 'error', message: 'No tienes permisos para realizar esta acción' });
};

export default isUserOrPremiumOwner;
