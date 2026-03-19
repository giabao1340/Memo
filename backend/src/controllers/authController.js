import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Session from '../models/Session.js';

dotenv.config();
const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
export const signUp = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Thiếu username, email, password, firstName hoặc lastName' });
        }
        // kiểm tra user đã tồn tại chưa
        const duplicate = await User.findOne({ username });
        if (duplicate) {
            return res.status(409).json({ massage: 'Username đã tồn tại' });
        }
        // băm mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // tạo user mới
        await User.create({
            username,
            email,
            hashedPassword: hashedPassword,
            displayName: `${firstName} ${lastName}`
        });

        res.status(204).json({ message: 'Đăng ký thành công' });

    } catch (error) {
        res.status(500).json({ massage: "Lỗi máy chủ khi đăng ký: " + error.message });
    }
};

export const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Sai username hoặc password' });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Sai username hoặc password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Sai username hoặc password' });
        }

        //Create access token (JWT) here if needed
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );
        //Create refresh token 
        const refreshToken = crypto.randomBytes(40).toString('hex');

        //create session to store refresh token in database
        await Session.create({
            userId: user._id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL) // 14 days
        });
        //return refresh token to cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',// deploy frontend and backend on different domain
            maxAge: REFRESH_TOKEN_TTL
        });
        //return access token to response
        res.status(200).json({ message: `User ${user.displayName} signed in successfully`, accessToken });
    } catch (error) {
        console.log("Lối khi gọi SignIn:", error);
        res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập: " + error.message });
    }
};

export const signOut = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token không tồn tại' });
        }
        await Session.deleteOne({ refreshToken: refreshToken });
        res.clearCookie('refreshToken');
        return res.status(204).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        console.log("Lỗi khi gọi signOut:", error);
        res.status(500).json({ message: "Lỗi máy chủ khi đăng xuất: " + error.message });
    }
};

export const reFreshToken = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Refresh token không tồn tại' });
        }

        // so sánh với refresh token trong database
        const session = await Session.findOne({ refreshToken: token });
        if (!session) {
            return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
        }
        //kiểm tra refresh token đã hết hạn chưa
        if (session.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Refresh token đã hết hạn' });
        }
        // tạo access token mới
        const accessToken = jwt.sign(
            { userId: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        // trả về access token mới
        res.status(200).json({ accessToken });

    } catch (error) {
        console.log("Lỗi khi gọi reFreshToken:", error);
        res.status(500).json({ message: "Lỗi máy chủ khi làm mới token: " + error.message });
    }
};
