import express from 'express';
import userController from '../userController.js';

const router = express.Router();

// User API
// GET /api/users - List all users
// POST /api/users - Create new user (signup)
router.get('/', userController);
router.post('/', userController);

// POST /api/users/login - Login
router.post('/login', userController);

// GET /api/users/:id - Get single user
router.get('/:id', userController);

// PUT /api/users/:id - Update user (admin role update)
router.put('/:id', userController);

// PUT /api/users/:id/profile - Update user profile
router.put('/:id/profile', userController);

// PUT /api/users/:id/profile/image - Update profile picture
router.put('/:id/profile/image', userController);

// PUT /api/users/:id/password - Change password
router.put('/:id/password', userController);

// DELETE /api/users/:id - Delete user
router.delete('/:id', userController);

export default router;

