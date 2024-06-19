// src/controllers/messageController.js
import messageService from '../services/messageService.js';

const getAllMessages = async (req, res) => {
    try {
        const messages = await messageService.getAllMessages();
        res.status(200).json({
            status: 'success',
            payload: messages
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener los mensajes:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const insertMessage = async (req, res) => {
    try {
        const newMessage = req.body;
        const createdMessage = await messageService.insertMessage(newMessage);
        res.status(201).json({
            status: 'success',
            payload: createdMessage
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al postear el mensaje:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getMessageById = async (req, res) => {
    try {
        const messageId = req.params.id;
        const message = await messageService.getMessageById(messageId);
        res.status(200).json({
            status: 'success',
            payload: message
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al obtener el mensaje:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const updateMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const newData = req.body;
        const updatedMessage = await messageService.updateMessage(messageId, newData);
        res.status(200).json({
            status: 'success',
            payload: updatedMessage
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al actualizar el mensaje:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const deletedMessage = await messageService.deleteMessage(messageId);
        res.status(200).json({
            status: 'success',
            payload: deletedMessage
        });
    } catch (error) {
        req.logger.warning ('Error en el controlador al eliminar el elmensaje:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export default {
    getAllMessages,
    insertMessage,
    getMessageById,
    updateMessage,
    deleteMessage
};
