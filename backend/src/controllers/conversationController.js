import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";
export const createConversation = async (req, res) => {
    try {
        const { type, name, memberIds } = req.body;
        const userId = req.user._id;

        if (
            !type ||
            (type === "group" && !name) ||
            !memberIds ||
            !Array.isArray(memberIds) ||
            memberIds.length === 0
        ) {
            return res
                .status(400)
                .json({ message: "Tên nhóm và danh sách thành viên là bắt buộc" });
        }

        let conversation;

        if (type === "direct") {
            const participantId = memberIds[0];

            conversation = await Conversation.findOne({
                type: "direct",
                "participants.userId": { $all: [userId, participantId] },
            });

            if (!conversation) {
                conversation = new Conversation({
                    type: "direct",
                    participants: [{ userId }, { userId: participantId }],
                    lastMessageAt: new Date(),
                });

                await conversation.save();
            }
        }

        if (type === "group") {
            conversation = new Conversation({
                type: "group",
                participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
                group: {
                    name,
                    createdBy: userId,
                },
                lastMessageAt: new Date(),
            });

            await conversation.save();
        }

        if (!conversation) {
            return res.status(400).json({ message: "Conversation type không hợp lệ" });
        }

        await conversation.populate([
            { path: "participants.userId", select: "displayName avatarUrl" },
            {
                path: "seenBy",
                select: "displayName avatarUrl",
            },
            { path: "lastMessage.senderId", select: "displayName avatarUrl" },
        ]);

        const participants = (conversation.participants || []).map((p) => ({
            _id: p.userId?._id,
            displayName: p.userId?.displayName,
            avatarUrl: p.userId?.avatarUrl ?? null,
            joinedAt: p.joinedAt,
        }));

        const formatted = { ...conversation.toObject(), participants };

        if (type === "group") {
            memberIds.forEach((userId) => {
                io.to(userId).emit("new-group", formatted)
            })
        }
        // Sau khi format xong, emit cho từng participant join room
        conversation.participants.forEach((p) => {
            io.to(p.userId._id.toString()).emit("join-conversation", formatted._id.toString());
        });

        // Emit conversation mới đến các thành viên (trừ người tạo vì họ đã có rồi)
        memberIds.forEach((memberId) => {
            io.to(memberId.toString()).emit("new-conversation", { conversation: formatted });
        });

        return res.status(201).json({ conversation: formatted });
        return res.status(201).json({ conversation: formatted })


    } catch (error) {
        console.error("Lỗi khi tạo conversation", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({
            'participants.userId': userId
        })
            .sort({ lastMessageAt: -1, updatedAt: -1 })
            .populate({
                path: 'participants.userId',
                select: 'displayName avatarUrl'
            })
            .populate({
                path: 'lastMessage.senderId',
                select: 'displayName avatarUrl'
            })
            .populate({
                path: 'seenBy',
                select: 'displayName avatarUrl'
            });
        const formated = conversations.map((convo) => {
            const participants = (convo.participants || []).map((p) => ({
                _id: p.userId?._id,
                displayName: p.userId?.displayName,
                avatarUrl: p.userId?.avatarUrl ?? null,
                joinedAt: p.joinedAt
            }));

            return {
                ...convo.toObject(),
                unreadCounts: convo.unreadCounts || {},
                participants,

            }
        })
        return res.status(200).json({ conversations: formated });
    } catch (error) {
        console.log("Lỗi khi lấy Conversation", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}
export const getMessages = async (req, res) => {

    try {
        const { conversationId } = req.params;
        const { limit = 50, cursor } = req.query;
        const query = { conversationId };

        if (cursor) { // nếu còn cursor thì query thêm tin nhắn cũ
            query.createdAt = { $lt: new Date(cursor) }; // less than -> convert cursor to date
        }
        let messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) + 1);// Lấy dư 1 tin để kiểm tra còn tin kế tiếp không
        //Kiểm tra còn trang kế tiếp không
        let nextCursor = null;
        if (messages.length > Number(limit)) {
            const nextMessages = messages[messages.length - 1];
            nextCursor = nextMessages.createdAt.toISOString();
            messages.pop();
        }
        messages = messages.reverse();
        res.status(200).json({ messages, nextCursor })

    } catch (error) {
        console.error("Lỗi khi get message", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }


}

export const getUserConversationsForSocketIO = async (userId) => {
    try {
        const conversations = await Conversation.find(
            { 'participants.userId': userId },
            { _id: 1 }
        );

        return conversations.map((c) => c._id.toString());
    } catch (error) {
        console.error(":Lỗi khi fetch conversations: ", error);
        return [];
    }
}

export const markAsSeen = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId).lean();

        if (!conversation) {
            return res.status(404).json({ message: "Conversation không tồn tại" });
        }

        const last = conversation.lastMessage;

        if (!last) {
            return res.status(200).json({ message: "Không có last message" });
        }

        if (last.senderId.toString() === userId.toString()) {
            return res.status(200).json({ message: "Không cần mark seen" });
        }

        const updated = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $addToSet: { seenBy: userId },
                $set: { [`unreadCounts.${userId}`]: 0 }
            },
            { new: true }
        ).lean();

        const lastMessage = updated?.lastMessage;

        io.to(conversationId).emit("read-message", {
            conversation: updated,
            lastMessage: lastMessage
                ? {
                    _id: lastMessage._id,
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt,
                    sender: {
                        _id: lastMessage.senderId,
                    },
                }
                : null,
        });

        return res.status(200).json({
            message: "Marked as seen",
            seenBy: updated?.seenBy || [],
            myUnreadCount: updated?.unreadCounts[userId] || 0
        });

    } catch (error) {
        console.error("🔥 Lỗi khi mark as seen:", error); // 👈 QUAN TRỌNG
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Conversation không tồn tại" });
        }

        await Message.deleteMany({ conversationId });
        await Conversation.findByIdAndDelete(conversationId);

        // Emit đến từng participant theo userId
        conversation.participants.forEach((p) => {
            io.to(p.userId.toString()).emit("conversation-deleted", { conversationId });
        });

        return res.status(200).json({ message: "Conversation đã được xóa" });
    } catch (error) {
        console.error("Lỗi khi xóa conversation:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const inviteMembers = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { memberIds } = req.body;
        const userId = req.user._id;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation không tồn tại" });
        }
        if (conversation.type !== "group") {
            return res.status(400).json({ message: "Chỉ có thể mời thành viên trong conversation type group" });
        }

        const newParticipants = memberIds
            .filter((id) => !conversation.participants.some((p) => p.userId.toString() === id))
            .map((id) => ({ userId: id }));

        conversation.participants.push(...newParticipants);
        await conversation.save();

        // ✅ Lấy SAU khi đã push newParticipants
        const allParticipantIds = conversation.participants.map((p) => p.userId.toString());
        // Populate thông tin user sau khi save
        const populated = await Conversation.findById(conversationId)
            .populate("participants.userId", "displayName avatarUrl username");

        const formatted = {
            ...populated.toObject(),
            participants: populated.participants.map((p) => ({
                _id: p.userId._id,
                displayName: p.userId.displayName,
                avatarUrl: p.userId.avatarUrl,
                username: p.userId.username,
                joinedAt: p.joinedAt,
            })),
        };

        allParticipantIds.forEach((id) => {
            io.to(id.toString()).emit("invite-members", {
                conversation: formatted,
                newMembers: newParticipants.map((p) => p.userId),
            });
        }
        );
        return res.status(200).json({ message: "Đã mời thành viên mới vào nhóm" });
    } catch (error) {
        console.error("Lỗi khi mời thành viên vào nhóm:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const leaveGroup = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Conversation không tồn tại" });
        }

        if (conversation.type !== "group") {
            return res.status(400).json({ message: "Chỉ có thể rời nhóm trong conversation type group" });
        }

        conversation.participants = conversation.participants.filter(
            (p) => p.userId.toString() !== userId.toString()
        );
        conversation.seenBy = conversation.seenBy.filter(
            (id) => id.toString() !== userId.toString()
        );
        if (conversation.unreadCounts) {
            conversation.unreadCounts.delete(userId.toString());
        }

        // Nếu không còn thành viên nào thì xóa luôn conversation
        if (conversation.participants.length === 0) {
            await Message.deleteMany({ conversationId });
            await Conversation.findByIdAndDelete(conversationId);
            io.to(userId.toString()).emit("conversation-deleted", { conversationId });
            return res.status(200).json({ message: "Đã xóa nhóm vì không còn thành viên" });
        }

        await conversation.save();

        io.to(userId.toString()).emit("group-left", { conversationId, userId });
        conversation.participants.forEach((p) => {
            io.to(p.userId.toString()).emit("group-left", { conversationId, userId });
        });

        return res.status(200).json({ message: "Đã rời nhóm" });
    } catch (error) {
        console.error("Lỗi khi rời nhóm:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};