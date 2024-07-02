// src/services/userService.js
import UserManager from '../dao/userDao.js';

const userManager = new UserManager();

const addUser = async (userData) => {
    try {
        console.log('Datos recibidos en userService.addUser:', userData);
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

export default {
    addUser,
    loginUser,
    getUser,
    requestPasswordReset,
    resetPassword
};