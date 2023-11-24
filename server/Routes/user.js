
import express from 'express';
import { updateUser, deleteUser, getAllUser, getSingleUser } from "../Controllers/userController.js";

import { authenticate, restrict } from '../auth/verifyToken.js';

const router = express.Router();

router.get('/', authenticate, restrict(['client', 'admin']), getAllUser)
router.get('/:id', authenticate, restrict(['client', 'admin']), getSingleUser)
router.put('/:id', authenticate, restrict(['client', 'admin']), updateUser)
router.delete('/:id', authenticate, restrict(['client', 'admin']), deleteUser)

export default router;


//authenticate means registered user 
//restrict to specific type of user 

// authenticate: This middleware verifies the authentication of the user by checking their token.
// restrict(['client']): This middleware restricts access to users with the 'client' role.