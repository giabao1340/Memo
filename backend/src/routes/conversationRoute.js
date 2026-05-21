import express from 'express';
import { createConversation, deleteConversation, getConversations, getMessages, inviteMembers, leaveGroup, markAsSeen } from '../controllers/conversationController.js';
import { checkFriendShip } from '../middleware/friendMiddleware.js';

const router = express.Router();

router.post('/', checkFriendShip, createConversation);
router.get('/', getConversations);
router.get('/:conversationId/messages', getMessages);
router.patch('/:conversationId/seen', markAsSeen);
router.patch('/:conversationId/invite', checkFriendShip, inviteMembers);
router.delete('/:conversationId', deleteConversation);
router.patch('/:conversationId/leave', leaveGroup);
export default router;