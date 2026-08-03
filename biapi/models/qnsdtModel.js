import db from '../db.js';

const normalizeString = (value) => {
    if (typeof value !== 'string') return '';
    return value.trim();
};

const extractYouTubeVideoId = (youtubeUrl) => {
    if (!youtubeUrl) return '';

    const match = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
    return match ? match[1] : '';
};

const buildThumbnailUrl = (youtubeUrl) => {
    const videoId = extractYouTubeVideoId(youtubeUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
};

const buildQuestionPayload = (payload) => {
    const questionType = normalizeString(payload.question_type) || 'objective';

    const normalizedPayload = {
        question: normalizeString(payload.question),
        question_type: questionType,
        option_a: normalizeString(payload.option_a),
        option_b: normalizeString(payload.option_b),
        option_c: normalizeString(payload.option_c),
        option_d: normalizeString(payload.option_d),
        correct_answer: normalizeString(payload.correct_answer),
        descriptive_answer: normalizeString(payload.descriptive_answer),
        description: normalizeString(payload.description),
        youtube_url: normalizeString(payload.youtube_url),
        thumbnail_url: normalizeString(payload.thumbnail_url),
        status: normalizeString(payload.status) || 'active'
    };

    if (normalizedPayload.youtube_url) {
        normalizedPayload.thumbnail_url = normalizedPayload.thumbnail_url || buildThumbnailUrl(normalizedPayload.youtube_url);
    }

    return normalizedPayload;
};

export const getQuestions = async ({ search = '', page = 1, limit = 10, sort = 'DESC' } = {}) => {
    const normalizedPage = Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number(limit) > 0 ? Number(limit) : 10;
    const offset = (normalizedPage - 1) * normalizedLimit;
    const normalizedSort = sort === 'ASC' ? 'ASC' : 'DESC';
    const searchTerm = `%${search}%`;

    const whereClauses = [];
    const queryParams = [];

    if (search) {
        whereClauses.push(`(
            question LIKE ? OR
            question_type LIKE ? OR
            option_a LIKE ? OR
            option_b LIKE ? OR
            option_c LIKE ? OR
            option_d LIKE ? OR
            correct_answer LIKE ? OR
            descriptive_answer LIKE ? OR
            description LIKE ? OR
            youtube_url LIKE ?
        )`);
        queryParams.push(
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm
        );
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const [rows] = await db.execute(
        `SELECT * FROM qns ${whereSql} ORDER BY created_at ${normalizedSort} LIMIT ?, ?`,
        [...queryParams, offset, normalizedLimit]
    );

    const [countRows] = await db.execute(
        `SELECT COUNT(*) AS total FROM qns ${whereSql}`,
        queryParams
    );

    const total = Number(countRows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / normalizedLimit));

    return {
        data: rows,
        pagination: {
            page: normalizedPage,
            limit: normalizedLimit,
            total,
            totalPages
        }
    };
};

export const getQuestionById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM qns WHERE id = ?', [id]);
    return rows[0] || null;
};

export const createQuestion = async (payload) => {
    const normalizedPayload = buildQuestionPayload(payload);

    const [result] = await db.execute(
        `INSERT INTO qns (
            question,
            question_type,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            descriptive_answer,
            description,
            youtube_url,
            thumbnail_url,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            normalizedPayload.question,
            normalizedPayload.question_type,
            normalizedPayload.option_a,
            normalizedPayload.option_b,
            normalizedPayload.option_c,
            normalizedPayload.option_d,
            normalizedPayload.correct_answer,
            normalizedPayload.descriptive_answer,
            normalizedPayload.description,
            normalizedPayload.youtube_url,
            normalizedPayload.thumbnail_url,
            normalizedPayload.status
        ]
    );

    return {
        id: result.insertId,
        ...normalizedPayload
    };
};

export const updateQuestion = async (id, payload) => {
    const normalizedPayload = buildQuestionPayload(payload);

    await db.execute(
        `UPDATE qns SET
            question = ?,
            question_type = ?,
            option_a = ?,
            option_b = ?,
            option_c = ?,
            option_d = ?,
            correct_answer = ?,
            descriptive_answer = ?,
            description = ?,
            youtube_url = ?,
            thumbnail_url = ?,
            status = ?
        WHERE id = ?`,
        [
            normalizedPayload.question,
            normalizedPayload.question_type,
            normalizedPayload.option_a,
            normalizedPayload.option_b,
            normalizedPayload.option_c,
            normalizedPayload.option_d,
            normalizedPayload.correct_answer,
            normalizedPayload.descriptive_answer,
            normalizedPayload.description,
            normalizedPayload.youtube_url,
            normalizedPayload.thumbnail_url,
            normalizedPayload.status,
            id
        ]
    );

    return {
        id,
        ...normalizedPayload
    };
};

export const deleteQuestion = async (id) => {
    const [result] = await db.execute('DELETE FROM qns WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
