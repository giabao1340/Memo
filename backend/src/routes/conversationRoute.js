import express from 'express';
import { createConversation, getConversation, getMessages, markAsSeen } from '../controllers/conversationController.js';
import { checkFriendShip } from '../middleware/friendMiddleware.js';

const router = express.Router();

router.post('/', checkFriendShip, createConversation);
router.get('/', getConversation);
router.get('/:conversationId/messages', getMessages);
router.patch('/:conversationId/seen', markAsSeen);
export default router;