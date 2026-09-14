import express from 'express';
import { signup, Login, getSessionUser, logout } from '../controllers/auth.controller.js';

const router = express.Router();
// Signup route
router.get('/session', getSessionUser);
router.post('/logout', logout);
router.post('/signup', signup); 
router.post('/login', Login); 

export default router;
