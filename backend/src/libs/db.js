import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('Kết nối CSDL thành công!');
    } catch (error) {
        console.error('Kết nối thất bại, lỗi:', error);
        process.exit(1);
    }
};