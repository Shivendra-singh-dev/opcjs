import express from 'express'; 
import { generateResponse } from '../controllers/aiController.js';

const router = express.Router();

router.post('/', generateResponse); 

export default router;
