// src/services/userService.js
import UserManager from '../dao/userManagerDB.js';

const userManager = new UserManager();

const addUser = async (userData) => {
    try {
        return await userManager.addUser(userData);
    } catch (error) {
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

export default {
    addUser,
    loginUser,
    getUser
};
