// src/middleware/roleMiddleware.js

const isAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }

    if (req.session.user.role !== 'admin') {
        return res.status(403).send({ status: 'error', message: 'No tienes permisos para realizar esta acción' });
    }

    return next();
};

const isUser = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }

    if (req.session.user.role !== 'user') {
        return res.status(403).send({ status: 'error', message: 'No tienes permisos para realizar esta acción' });
    }

    return next();
};

const isPremium = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }

    if (req.session.user.role !== 'premium') {
        return res.status(403).send({ status: 'error', message: 'No tienes permisos para realizar esta acción' });
    }

    return next();
};

const isAdminOrPremium = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }

    if (req.session.user.role !== 'admin' && req.session.user.role !== 'premium') {
        return res.status(403).send({ status: 'error', message: 'No tienes permisos para realizar esta acción' });
    }

    return next();
};

const isUserOrPremium = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }

    if (req.session.user.role !== 'user' && req.session.user.role !== 'premium') {
        return res.status(403).send({ status: 'error', message: 'No tienes permisos para realizar esta acción' });
    }

    return next();
};

// Exportar todas las funciones
export {
    isAdmin,
    isUser,
    isPremium,
    isAdminOrPremium,
    isUserOrPremium
};
