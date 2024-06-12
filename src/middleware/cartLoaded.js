import userModel from '../dao/models/userModel.js';

const ensureCartLoaded = async (req, res, next) => {
    if (req.user && (!req.user.cart || typeof req.user.cart === 'string')) {
        try {
            const userWithCart = await userModel.findById(req.user._id).populate('cart');
            req.user.cart = userWithCart.cart;
            next();
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            res.status(500).send({ status: 'error', message: 'Error al cargar el carrito' });
        }
    } else {
        next();
    }
};

export default ensureCartLoaded;