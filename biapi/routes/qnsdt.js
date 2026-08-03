import express from 'express';
import {
    listQuestions,
    getQuestion,
    createQuestionHandler,
    updateQuestionHandler,
    deleteQuestionHandler
} from '../controllers/qnsdtController.js';
import { validateQuestion } from '../middleware/qnsdtValidation.js';

const router = express.Router();

router.get('/', listQuestions);
router.get('/:id', getQuestion);
router.post('/', validateQuestion, createQuestionHandler);
router.put('/:id', validateQuestion, updateQuestionHandler);
router.delete('/:id', deleteQuestionHandler);

export default router;
