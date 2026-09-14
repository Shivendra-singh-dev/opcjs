import express from 'express';
import { createUser,getAllUsers,getUserByIdHandler,getUserProfile,updateUserProfile,updateProfileImage,updateUser,changePassword,deleteUser} from '../controllers/user.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();


// Protected routes (authentication required - add auth middleware)
// GET /api/users - List all users (with pagination)
router.get('/', authMiddleware, getAllUsers);
router.post('/', authMiddleware, createUser);

// GET /api/users/:id - Get single user
router.get('/:id', authMiddleware, getUserByIdHandler);

// PUT /api/users/:id - Update user (admin role update)
router.put('/:id', authMiddleware, updateUser);

// get /api/users/:id/profile - get user profile
router.get('/:id/profile', authMiddleware, getUserProfile);
// PUT /api/users/:id/profile - Update user profile
router.put('/:id/profile', authMiddleware, updateUserProfile);

// PUT /api/users/:id/profile/image - Update profile picture
router.put('/:id/profile/image', authMiddleware, updateProfileImage);

// PUT /api/users/:id/password - Change password
router.put('/:id/password', authMiddleware, changePassword);

// DELETE /api/users/:id - Delete user
router.delete('/:id', authMiddleware, deleteUser);


export default router;