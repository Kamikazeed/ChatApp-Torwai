import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/msgController.js';

const msgRouter = express.Router();

msgRouter.get('/users', protectRoute, getUsersForSidebar);
msgRouter.get('/:id', protectRoute, getMessages);
msgRouter.put('/mark/:id', protectRoute, markMessageAsSeen);
msgRouter.post('/send/:id', protectRoute, sendMessage);

export default msgRouter;