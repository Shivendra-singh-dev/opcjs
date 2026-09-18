import express from 'express';
import { signup, Login, forgotPassword, getSessionUser, logout } from '../controllers/auth.controller.js';

const router = express.Router();
// Signup route
router.get('/session', getSessionUser);// for test session data
router.post('/logout', logout);
router.post('/signup', signup); 
router.post('/login', Login); 
router.post('/forgot-password', forgotPassword);

export default router;
