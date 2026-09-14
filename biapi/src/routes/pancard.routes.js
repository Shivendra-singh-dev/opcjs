import express from 'express';
import { pancardCreate,getAllPancards,deletePancard,getPancardById,pancardUpdate } from '../controllers/pancard.controller.js';

const router = express.Router();

// Define your routes here
router.get('/', getAllPancards);
router.get('/:id', getPancardById);
router.post('/create', pancardCreate);
router.put('/:id', pancardUpdate);
router.delete('/:id', deletePancard);

export default router;

