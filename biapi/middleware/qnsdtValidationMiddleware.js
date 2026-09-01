export const validateQuestion = (req, res, next) => {
    const { question, question_type, option_a, option_b, option_c, option_d, correct_answer, descriptive_answer } = req.body;
    const errors = [];

    if (!question || !String(question).trim()) {
        errors.push('Question is required');
    }

    if (!['objective', 'descriptive'].includes(question_type)) {
        errors.push('Question type must be either objective or descriptive');
    }

    if (question_type === 'objective') {
        if (!option_a || !String(option_a).trim()) errors.push('Option A is required');
        if (!option_b || !String(option_b).trim()) errors.push('Option B is required');
        if (!option_c || !String(option_c).trim()) errors.push('Option C is required');
        if (!option_d || !String(option_d).trim()) errors.push('Option D is required');
        if (!correct_answer || !String(correct_answer).trim()) errors.push('Correct answer is required');
    }

    if (question_type === 'descriptive' && (!descriptive_answer || !String(descriptive_answer).trim())) {
        errors.push('Answer is required for descriptive questions');
    }

    if (errors.length) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};
