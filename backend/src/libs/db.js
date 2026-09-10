import mongoose from 'mongoose';
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('Kết nối CSDL thành công!');
    } catch (error) {
        console.error('Kết nối thất bại, lỗi:', error);
        process.exit(1);
    }
};