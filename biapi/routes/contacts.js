import express from 'express';
import contactController from '../controllers/contactController.js';

const router = express.Router();

// Contact API
// GET /api/contacts
// POST /api/contacts
router.get('/', contactController);
router.post('/', contactController);

export default router;

