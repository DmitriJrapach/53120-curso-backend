// src/controllers/userController.js
import userModel from '../dao/models/userModel.js';
import userService from '../services/userService.js';
import { userDTO } from '../dto/userDTO.js';

const githubAuth = (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
};

const githubCallback = (req, res) => {
    console.log("Datos recibidos de GitHub:", req.user);
    req.session.user = req.user;
     // Enviar el email y la contraseña provisoria como parte de la cadena de consulta
     const email = encodeURIComponent(req.user.email);
     const password = encodeURIComponent("12345");
     res.redirect(`/login?email=${email}&password=${password}`);
};

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        console.log('Datos recibidos para registrar:', { first_name, last_name, email, age, password });
        const result = await userService.addUser({ first_name, last_name, email, age, password });
        res.redirect('/login');
    } catch (error) {
        req.logger.warning ('Error en el controlador al registarr usuario:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        
        res.cookie('auth', user.token, { maxAge: 60 * 60 * 1000, httpOnly: true });

        req.session.user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cartId: user.cart._id.toString()
        };

        console.log('Usuario guardado en la sesión con cartId:', req.session.user);
        res.redirect('/products');
    } catch (error) {
        req.logger.warning ('Error en el controlador al logearse:', error);
        res.redirect('/login');
    }
};

const current = (req, res) => {
    const user = userDTO(req.user);
    res.send({
        user
    });
};

const getUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const result = await userService.getUser(uid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener al usuario', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('userManager', { 
            title: 'User Manager',
            style: 'index.css',
             users
            });
    } catch (error) {
        req.logger.warning('Error al obtener la lista de usuarios', error);
        res.status(500).send({
            status: 'error',
            message: 'Error al obtener la lista de usuarios'
        });
    }
};

const logout = (req, res) => {
    req.session.destroy(error => {
        res.redirect("/login");
    });
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await userService.requestPasswordReset(email);
        res.send(response.message);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        console.log('Datos recibidos en userController.resetPassword:', { token, newPassword });

        const response = await userService.resetPassword(token, newPassword);
        console.log('Respuesta de userService.resetPassword:', response);

        res.send(response.message);
    } catch (error) {
        console.log('Error en userController.resetPassword:', error.message);
        res.status(400).send(error.message);
    }
};

const changeUserRole = async (req, res) => {
    const { uid } = req.params; // ID del usuario

    try {
        const user = await userService.getUser(uid);

        if (!user) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }

        user.role = (user.role === 'user') ? 'premium' : 'user';
        await userService.updateUserRole(user._id, user.role);

        return res.send({ status: 'success', message: `Rol cambiado a ${user.role}` });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        return res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
};

export default {
    githubAuth,
    githubCallback,
    register,
    login,
    current,
    getUser,
    getAllUsers,
    logout,
    requestPasswordReset,
    resetPassword,
    changeUserRole
};