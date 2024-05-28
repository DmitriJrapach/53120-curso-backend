

// src/routes/messageRouter.js
import { Router } from 'express';
import messageController from '../controllers/messageController.js';

const router = Router();

router.get('/messages', messageController.getAllMessages);

router.post('/messages', messageController.insertMessage);

router.get('/messages/:id', messageController.getMessageById);

router.put('/messages/:id', messageController.updateMessage);

router.delete('/messages/:id', messageController.deleteMessage);

export default router;
