import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        trim: true,
        maxlength: 300,
    }
}, {
    timestamps: true,
});

FriendSchema.index({ from: 1, to: 1 }, { unique: true }); // Đảm bảo rằng mỗi cặp bạn bè chỉ tồn tại một lần
FriendSchema.index({ from: 1 }); // truy vấn nhanh các yêu cầu kết bạn đã gửi đi
FriendSchema.index({ to: 1 }); // truy vấn nhanh các yêu cầu kết bạn đã nhận được

const FriendRequest = mongoose.model("FriendRequest", FriendSchema);
export default FriendRequest;