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
        return await userManager.loginUser(email, password);
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
    getUser,
    getAllUsers,
    requestPasswordReset,
    resetPassword,
    updateUserRole
};