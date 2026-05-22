import express from "express";
import { deleteMessage, sendDirectMessage, sendGroupMessage } from "../controllers/messageController.js";
import { checkFriendShip, checkGroupMembership } from "../middleware/friendMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post('/direct', upload.array('images', 5), checkFriendShip, sendDirectMessage);
router.post('/group', upload.array('images', 5), checkGroupMembership, sendGroupMessage);
router.delete('/:messageId', deleteMessage);

export default router;