import {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
} from '../models/qnsdtModel.js';

export const listQuestions = async (req, res, next) => {
    try {
        const { search = '', page = 1, limit = 10, sort = 'DESC' } = req.query;
        const result = await getQuestions({ search, page, limit, sort });

        return res.status(200).json({
            success: true,
            message: 'Questions fetched successfully',
            ...result
        });
    } catch (error) {
        next(error);
    }
};

export const getQuestion = async (req, res, next) => {
    try {
        const question = await getQuestionById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Question fetched successfully',
            data: question
        });
    } catch (error) {
        next(error);
    }
};

export const createQuestionHandler = async (req, res, next) => {
    try {
        const question = await createQuestion(req.body);

        return res.status(201).json({
            success: true,
            message: 'Question created successfully',
            data: question
        });
    } catch (error) {
        next(error);
    }
};

export const updateQuestionHandler = async (req, res, next) => {
    try {
        const question = await updateQuestion(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            data: question
        });
    } catch (error) {
        next(error);
    }
};

export const deleteQuestionHandler = async (req, res, next) => {
    try {
        const deleted = await deleteQuestion(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
