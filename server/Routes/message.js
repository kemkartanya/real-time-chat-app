import express from 'express';
import { 
    createMessage,
    updateMessage, 
    deleteMessage, 
    getAllMessage, 
    getUserMessage,
    getSingleMessage } 
    from "../Controllers/messageController.js";

import { authenticate } from '../auth/verifyToken.js';

const router = express.Router();

router.get('/', authenticate, getAllMessage)
router.get('/:id', getSingleMessage)
router.get('/user/:userId', getUserMessage)
router.post('/', authenticate, createMessage)
router.put('/:id', updateMessage)
router.delete('/:id', deleteMessage)

export default router;