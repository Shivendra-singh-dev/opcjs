import express from 'express';

import {getSlib,createSlib,updateSlib,deleteSlib,getViewSlib} from '../controllers/smart-library.controller.js';


const router = express.Router();
console.log('Routes : ',router)
// CRUD Routes
router.get('/', getSlib);              // Read all
router.get('/:id', getViewSlib);           // Read one
router.post('/', createSlib);           // Create
router.put('/:id', updateSlib);       // Update
router.delete('/:id', deleteSlib);    // Delete

export default router;

