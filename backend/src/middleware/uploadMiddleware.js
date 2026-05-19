import multer from "multer";
import cloudinary from '../config/cloudinary.js';
// Cấu hình multer để lưu trữ file tạm thời

export const upload = multer({
    storage: multer.memoryStorage(),// Lưu trữ file trong bộ nhớ RAM
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export const uploadAvatarImageFromBuffer = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "memo_chat/avatar",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
            // transformation: [{ width: 200, height: 200, crop: "fill" }],
            ...options,
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
        uploadStream.end(buffer);
    });
};

export const uploadMessageImageFromBuffer = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "memo_chat/messages",
            resource_type: "image",
            transformation: [{ width: 1280, crop: "limit" }],
            ...options,
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
        uploadStream.end(buffer);
    });
};

// Gửi nhiều ảnh cùng lúc
export const uploadMultipleMessageImages = async (buffers, options) => {
    return Promise.all(
        buffers.map((buffer) => uploadMessageImageFromBuffer(buffer, options))
    );
};
