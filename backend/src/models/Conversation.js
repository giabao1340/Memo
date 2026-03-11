import mongoose from "mongoose"

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    }
},
    {
        _id: false,
    });

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const lastMessage = new mongoose.Schema({
    _id: { type: "string" },
    content: {
        type: String,
        default: null,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: null
    }
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
    type: {
        type: String,// chuoi rong
        enum: ['direct', 'group'], //chat truc tiep hoac nhom
    },
    participants: {
        type: [participantSchema],
        required: true
    },
    group: {
        type: [groupSchema]
    },
    lastMessageAt: {
        type: Date
    },
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    lastMessage: {
        type: [lastMessage],

    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true }
);

ConversationSchema.index({
    "participant.userId": 1,// nguoi tham gia
    lastMessageAt: -1 // sap xep theo thoi gian tin nhan cuoi cung
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;