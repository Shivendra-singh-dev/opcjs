import express from 'express';

import {getSliders,getDeals,getSocialmedia,getPromotionads,getBigsell} from '../controllers/pageControllers.js';

const router = express.Router();

router.get('/sliders', getSliders);
router.get('/deals', getDeals);
router.get('/social-media', getSocialmedia);
router.get('/promotion-ads', getPromotionads);
router.get('/big-sell', getBigsell);

export default router;