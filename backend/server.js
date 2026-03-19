import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/libs/db.js';
import authRoute from './src/routes/authRoute.js';
import userRoute from './src/routes/userRoute.js';
import { protectedRoute } from './src/middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import friendRoute from './src/routes/friendRoute.js';
import messageRoute from './src/routes/messageRoute.js';
import conversationRoute from './src/routes/conversationRoute.js';
import {app, server, io} from './src/socket/index.js';


dotenv.config();

// const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL, // Thay đổi nếu frontend chạy trên cổng khác
    credentials: true, // Cho phép gửi cookie
}));

//public routes
app.use('/api/auth', authRoute);
//private routes
app.use('/api', protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);
app.use('/api/messages', messageRoute)
app.use('/api/conversations', conversationRoute);

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server bắt đầu trên cổng ${PORT}`);
    });
});