import express from 'express'

import {getSliders,createSliders,updateSliders,deleteSliders,getViewSliders} from '../controllers/SlidersController.js';


const router = express.Router();
console.log('Routes : ',router) 

router.get('/', getSliders);
router.get('/:id', getViewSliders);
router.post('/', createSliders);
router.put('/:id', updateSliders);
router.delete('/:id', deleteSliders);


export default router;