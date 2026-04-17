import { uploadAvatarImageFromBuffer } from "../middleware/uploadMiddleware.js";
import User from "../models/User.js";

export const authMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Lỗi khi xử lý authMe: ', error);
        res.status(500).json({ message: 'Lỗi hệ thống: ' + error });
    }
};

export const searchUserByUsername = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username || username.trim() === "") {
            return res.status(400).json({ message: "Cần cung cấp username trong query" });
        }
        const user = await User.findOne({ username }).select(
            "_id displayName username avatarUrl"
        );
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Lỗi xãy ra khi searchUserByUsername: ", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const uploadAvatar = async (req, res) => {
    try {
        const file = req.file;
        const userId = req.user._id;
        if (!file) {
            return res.status(400).json({ message: "Không có file nào được tải lên" });
        }
        // Upload ảnh lên Cloudinary
        const result = await uploadAvatarImageFromBuffer(file.buffer);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatarUrl: result.secure_url },
            { new: true }
        ).select("avatarUrl");

        if (!updatedUser.avatarUrl) {
            return res.status(500).json({ message: "avatar null" });
        }
        return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
    } catch (error) {
        console.error("Lỗi xảy ra khi uploadAvatar: ", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}