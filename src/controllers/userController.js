// src/controllers/userController.js
import userService from '../services/userService.js';

const githubAuth = (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
};

const githubCallback = (req, res) => {
    console.log("Datos recibidos de GitHub:", req.user);
    req.session.user = req.user;
    res.redirect('/products');
};

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const result = await userService.addUser({ first_name, last_name, email, age, password });
        res.redirect('/login');
    } catch (error) {
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
            role: user.role
        };

        res.redirect('/products');
    } catch (error) {
        res.redirect('/login');
    }
};

const current = (req, res) => {
    res.send({
        user: req.user
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
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const logout = (req, res) => {
    req.session.destroy(error => {
        res.redirect("/login");
    });
};

export default {
    githubAuth,
    githubCallback,
    register,
    login,
    current,
    getUser,
    logout
};
