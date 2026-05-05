import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { emitNewMessage, updateConversationAfterCreateMessage } from "../utils/messageHelper.js";
import { io } from "../socket/index.js"
import { uploadMultipleMessageImages } from "../middleware/uploadMiddleware.js";


const uploadImages = async (files) => {
    if (!files?.length) return [];
    const results = await uploadMultipleMessageImages(
        files.map((f) => f.buffer)
    );
    return results.map((r) => r.secure_url);
};

export const sendDirectMessage = async (req, res) => {
    try {
        const { recipientId, content, conversationId } = req.body;
        const senderId = req.user._id;

        if (!content && !req.files?.length) {
            return res.status(400).json({ message: "Thiếu nội dung" });
        }

        let conversation;
        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        }
        if (!conversation) {
            conversation = await Conversation.create({
                type: "direct",
                participants: [
                    { userId: senderId, joinedAt: new Date() },
                    { userId: recipientId, joinedAt: new Date() },
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map(),
            });
        }

        const imgUrls = await uploadImages(req.files);

        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content,
            imgUrls,
        });

        updateConversationAfterCreateMessage(conversation, message, senderId);
        await conversation.save();
        emitNewMessage(io, conversation, message);
        return res.status(201).json({ message });
    } catch (error) {
        console.error("Lỗi xảy ra khi gửi tin nhắn trực tiếp", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const sendGroupMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { conversationId, content } = req.body;
        const conversation = req.conversation;

        if (!content && !req.files?.length) {
            return res.status(400).json({ message: "Thiếu nội dung" });
        }

        const imgUrls = await uploadImages(req.files);

        const message = await Message.create({
            conversationId,
            senderId,
            content,
            imgUrls,
        });

        updateConversationAfterCreateMessage(conversation, message, senderId);
        await conversation.save();

        emitNewMessage(io, conversation, message);
        return res.status(201).json({ message });
    } catch (error) {
        console.error("Lỗi xảy ra khi gửi tin nhắn nhóm", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const senderId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Tin nhắn không tồn tại" });
        }

        if (message.senderId.toString() !== senderId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền xóa tin nhắn này" });
        }

        const conversationId = message.conversationId;

        await Message.findByIdAndDelete(messageId);

        // 🔥 TÌM LẠI LAST MESSAGE MỚI
        const lastMessage = await Message.findOne({ conversationId })
            .sort({ createdAt: -1 });

        const conversation = await Conversation.findById(conversationId);

        if (lastMessage) {
            conversation.lastMessage = {
                _id: lastMessage._id,
                content: lastMessage.content || "Đã xóa một tin nhắn",
                senderId: lastMessage.senderId,
                createdAt: lastMessage.createdAt,
            };
            conversation.lastMessageAt = lastMessage.createdAt;
        } else {
            // 👉 không còn tin nhắn nào
            conversation.lastMessage = null;
            conversation.lastMessageAt = null;
        }

        await conversation.save();

        // 🔥 emit cả delete + update conversation
        io.to(conversationId.toString()).emit("delete-message", {
            messageId,
            conversationId,
        });

        io.to(conversationId.toString()).emit("conversation-updated", {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
        });

        return res.status(200).json({ message: "Xóa tin nhắn thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa tin nhắn:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};