import express from 'express';
import { signUp, signIn, signOut, reFreshToken, test } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/refresh', reFreshToken);
router.get('/test', test);
export default router;