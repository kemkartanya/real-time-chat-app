import express from 'express';
import { 
    createMessage,
    updateMessage, 
    deleteMessage, 
    getAllMessage, 
    getUserMessage,
    getSingleMessage } 
    from "../Controllers/messageController.js";

import { authenticate, restrict } from '../auth/verifyToken.js';

const router = express.Router();

router.get('/', authenticate, restrict(['admin', 'client']), getAllMessage)
router.get('/:id', authenticate, restrict(['admin', 'client']), getSingleMessage)
router.get('/user/:userId', authenticate, restrict(['admin', 'client']), getUserMessage)
router.post('/', authenticate, restrict(['admin', 'client']), createMessage)
router.put('/:id', authenticate, restrict(['admin', 'client']), updateMessage)
router.delete('/:id', authenticate, restrict(['admin', 'client']), deleteMessage)

export default router;