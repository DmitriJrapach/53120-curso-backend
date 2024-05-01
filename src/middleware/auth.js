
import { isValidPassword } from '../utils/functionsUtils.js';
import userModel from '../dao/models/userModel.js';

const auth = async function (req, res, next) {
    try {
        req.session.failLogin = false;
        const { email, password } = req.body;

        // Verifica si el usuario existe en la base de datos
        const user = await userModel.findOne({ email }).lean();

        if (!user || !isValidPassword(user, password)) {
            req.session.failLogin = true;
            return res.redirect("http://localhost:8080/products/login?error=Usuario o contraseña incorrectos");
        }

        // Elimina la contraseña del usuario antes de almacenarlo en la sesión
        delete user.password;

        // Almacena los datos del usuario en la sesión
        req.session.user = user;

        // Si la autenticación es exitosa, pasa al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error('Error during authentication:', error);
        req.session.failLogin = true;
        return res.redirect("http://localhost:8080/products/login");
    }
};

export default auth;