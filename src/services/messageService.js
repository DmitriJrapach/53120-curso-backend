// src/services/messageService.js
import { messageManagerDB } from '../dao/messageManagerDB.js';

const messageManager = new messageManagerDB();

const getAllMessages = async () => {
    try {
        return await messageManager.getAllMessages();
    } catch (error) {
        throw new Error(error.message);
    }
};

const insertMessage = async (newMessage) => {
    try {
        return await messageManager.insertMessage(newMessage);
    } catch (error) {
        throw new Error(error.message);
    }
};

const getMessageById = async (id) => {
    try {
        return await messageManager.getMessageById(id);
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateMessage = async (id, newData) => {
    try {
        return await messageManager.updateMessage(id, newData);
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteMessage = async (id) => {
    try {
        return await messageManager.deleteMessage(id);
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getAllMessages,
    insertMessage,
    getMessageById,
    updateMessage,
    deleteMessage
};
