import express from 'express';
import contactController from '../controllers/contactController.js';

const router = express.Router();

router.get('/', contactController.getContacts);
router.post('/create', contactController.createContact);


export default router;

