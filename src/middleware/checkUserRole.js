const checkUserRole = function (req, res, next) {
    const userRole = req.session.user.role;
    
    if (userRole === 'user') {
        // Si el rol del usuario es 'user', pasamos al siguiente middleware o controlador
        next();
    } else if (userRole === 'admin') {
        // Si el rol del usuario es 'admin', redirigimos a la página de productos en tiempo real
        return res.redirect("http://localhost:8080/products/realtimeproducts");
    } else {
        // Manejo para otros roles (si es necesario)
        return res.status(403).send("Acceso prohibido"); // Por ejemplo, podríamos devolver un código de estado 403 para otros roles
    }
};

export default checkUserRole;