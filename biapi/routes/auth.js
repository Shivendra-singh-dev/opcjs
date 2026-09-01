import express from 'express';
import { signup, Login, getSessionUser, logout } from '../controllers/authController.js';

const router = express.Router();
// Signup route
router.get('/session', getSessionUser);
router.post('/logout', logout);
router.post('/signup', signup); 
router.post('/login', Login); 

export default router;
