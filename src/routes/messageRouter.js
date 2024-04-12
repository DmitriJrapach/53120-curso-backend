import { Router } from 'express';
import { messageManagerDB } from "../dao/messageManagerDB.js"


const router = Router();
const MessageService = new messageManagerDB();


router.get('/messages', async (req, res) => {
    const result = await MessageService.getAllMessages();

    res.send({
        status: 'success',
        payload: result
    });
});

router.get('/user', async (req, res) => {
    const result = await MessageService.getMessagesByUser();

    res.send({
        status: 'success',
        payload: result
    });
});
