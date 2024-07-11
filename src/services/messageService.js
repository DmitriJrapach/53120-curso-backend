// src/services/messageService.js
import MessageRepository from '../dao/repositories/messageRepository.js';

const messageRepository = new MessageRepository();

const getAllMessages = async () => {
    try {
        return await messageRepository.getAllMessages();
    } catch (error) {
        throw new Error(error.message);
    }
};

const insertMessage = async (newMessage) => {
    try {
        return await messageRepository.insertMessage(newMessage);
    } catch (error) {
        throw new Error(error.message);
    }
};

const getMessageById = async (id) => {
    try {
        return await messageRepository.getMessageById(id);
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateMessage = async (id, newData) => {
    try {
        return await messageRepository.updateMessage(id, newData);
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteMessage = async (id) => {
    try {
        return await messageRepository.deleteMessage(id);
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
