// src/services/userService.js
import UserManager from '../dao/userDao.js';

const userManager = new UserManager();

const addUser = async (userData) => {
    try {
        return await userManager.addUser(userData);
    } catch (error) {
        console.error('Error en userService.addUser:', error.message);
        throw new Error(error.message);
    }
};


const loginUser = async (email, password) => {
    try {
        const user = await userManager.loginUser(email, password);
        if (user) {
            await userManager.updateLastConnection(user._id); // Actualizar la última conexión en el login
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateLastConnection = async (userId) => {
    try {
        return await userManager.updateLastConnection(userId);
    } catch (error) {
        throw new Error(error.message);
    }
};

const getUser = async (uid) => {
    try {
        return await userManager.getUser(uid);
    } catch (error) {
        throw new Error(error.message);
    }
};
const getUserByEmail = async (email) => {
    try {
        return await userManager.getUserByEmail(email);
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllUsers = async () => {
    try {
        return await userManager.getAllUsers();
    } catch (error) {
        console.error('Error en userService.getAllUsers:', error.message);
        throw new Error('Error al obtener todos los usuarios');
    }
};

const requestPasswordReset = async (email) => {
    try {
        return await userManager.requestPasswordReset(email);
    } catch (error) {
        throw new Error(error.message);
    }
};

const resetPassword = async (token, newPassword) => {
    try {
        return await userManager.resetPassword(token, newPassword);
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateUserRole = async (userId, newRole) => {
    try {
        return await userManager.updateUserRole(userId, newRole);
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    addUser,
    loginUser,
    updateLastConnection,
    getUser,
    getUserByEmail,
    getAllUsers,
    requestPasswordReset,
    resetPassword,
    updateUserRole
};