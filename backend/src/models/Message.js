import mongooes from 'mongoose'

const MessageSchema = new mongooes.Schema(
    {
        conversationId: {
            type: mongooes.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },
        senderId: {
            type: mongooes.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            trim: true,
        },
        imgUrls: {
            type: [String],
            default: [],
        },

    },
    {
        timestamps: true,
    }
);

MessageSchema.index({conversationId: 1, createdAt: -1});

const Message = mongooes.model("Message", MessageSchema);

export default Message;