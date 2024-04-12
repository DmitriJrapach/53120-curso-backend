import { Router } from 'express';
import { messageManagerDB } from "../dao/messageManagerDB.js";

const router = Router();
const MessageService = new messageManagerDB();

router.get('/messages', async (req, res) => {
    try {
        const messages = await MessageService.getAllMessages();
        res.status(200).json({
            status: 'success',
            payload: messages
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/messages', async (req, res) => {
    try {
        const newMessage = req.body;
        const createdMessage = await MessageService.insertMessage(newMessage);
        res.status(201).json({
            status: 'success',
            payload: createdMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/messages/:id', async (req, res) => {
    try {
        const messageId = req.params.id;
        const message = await MessageService.getMessageById(messageId);
        res.status(200).json({
            status: 'success',
            payload: message
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/messages/:id', async (req, res) => {
    try {
        const messageId = req.params.id;
        const newData = req.body;
        const updatedMessage = await MessageService.updateMessage(messageId, newData);
        res.status(200).json({
            status: 'success',
            payload: updatedMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/messages/:id', async (req, res) => {
    try {
        const messageId = req.params.id;
        const deletedMessage = await MessageService.deleteMessage(messageId);
        res.status(200).json({
            status: 'success',
            payload: deletedMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;