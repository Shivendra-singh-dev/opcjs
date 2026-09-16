import db from "../config/database.js";
import bcrypt from "bcryptjs";

const userModel = {
    // Login: find user by email OR mobile
    loginUser: async (emailOrMobile) => {
        const query = `
            SELECT id, name, mobile, email, password, role, status,
                   profile_picture, address, city, state, zip_code, country,
                   created_at, updated_at
            FROM users
            WHERE email = ? OR mobile = ?
            LIMIT 1
        `;

        const [rows] = await db.execute(query, [
            emailOrMobile,
            emailOrMobile
        ]);

        return rows.length > 0 ? rows[0] : null;
    },

    // Create user during signup
    signupUser: async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const query = `
            INSERT INTO users (name, mobile, email, password)
            VALUES (?, ?, ?, ?)
        `;

        const values = [
            userData.name,
            userData.mobile,
            userData.email,
            hashedPassword
        ];

        const [result] = await db.execute(query, values);

        return {
            id: result.insertId,
            name: userData.name,
            mobile: userData.mobile,
            email: userData.email
        };
    },

    // Get user by mobile
    getUserByMobile: async (mobile) => {
        const query = `
            SELECT id, name, mobile, email, password
            FROM users
            WHERE mobile = ?
            LIMIT 1
        `;

        const [rows] = await db.execute(query, [mobile]);

        return rows.length > 0 ? rows[0] : null;
    },

    // Create user
    createUser: async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const query = `
            INSERT INTO users (name, email, mobile, password)
            VALUES (?, ?, ?, ?)
        `;

        const values = [
            userData.name,
            userData.email,
            userData.mobile,
            hashedPassword
        ];

        const [result] = await db.execute(query, values);

        return {
            id: result.insertId,
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile
        };
    },

    // Get user by ID
    getUserById: async (id) => {
        const query = `
            SELECT id, name, mobile, email, role, status,
                   profile_picture, address, city, state, zip_code, country,
                   created_at, updated_at
            FROM users
            WHERE id = ?
            LIMIT 1
        `;

        const [rows] = await db.execute(query, [id]);

        return rows.length > 0 ? rows[0] : null;
    },

    // Get user by email
    getUserByEmail: async (email) => {
        const query = `
            SELECT id, name, mobile, email, password
            FROM users
            WHERE email = ?
            LIMIT 1
        `;

        const [rows] = await db.execute(query, [email]);

        return rows.length > 0 ? rows[0] : null;
    },

    // Update user
    updateUser: async (id, userData) => {
        const query = `
            UPDATE users
            SET name = ?, email = ?
            WHERE id = ?
        `;

        const [result] = await db.execute(query, [
            userData.name,
            userData.email,
            id
        ]);

        return result.affectedRows > 0;
    },

    // Delete user
    deleteUser: async (id) => {
        const query = `
            DELETE FROM users
            WHERE id = ?
        `;

        const [result] = await db.execute(query, [id]);

        return result.affectedRows > 0;
    },

    // Get all users
    getAllUsers: async () => {
        const query = `
            SELECT id, name, mobile, email, role, status,
                   profile_picture, address, city, state, zip_code, country,
                   created_at, updated_at
            FROM users
            ORDER BY id DESC
        `;

        const [rows] = await db.execute(query);

        return rows;
    },

    findById: async (id) => {
        const query = `
            SELECT id, name, mobile, email, role, status,
                   profile_picture, address, city, state, zip_code, country,
                   created_at, updated_at
            FROM users
            WHERE id = ?
            LIMIT 1
        `;

        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    // Controller expects two parameters: email and mobile
    findByEmailOrMobile: async (email, mobile) => {
        const query = `
            SELECT id, name, mobile, email, password, role, status,
                   profile_picture, address, city, state, zip_code, country,
                   created_at, updated_at
            FROM users
            WHERE email = ? OR mobile = ?
            LIMIT 1
        `;

        const [rows] = await db.execute(query, [email, mobile]);
        return rows.length > 0 ? rows[0] : null;
    },

    findAll: async ({ page = 1, limit = 10, search = "" } = {}) => {
        const offset = (page - 1) * limit;
        let query = `
            SELECT id, name, mobile, email, role, status,
                   profile_picture, address, city, state, zip_code, country,
                   created_at, updated_at
            FROM users
        `;

        let countQuery = `SELECT COUNT(*) AS total FROM users`;
        const params = [];

        if (search) {
            const searchCondition = ` WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?`;
            query += searchCondition;
            countQuery += searchCondition;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await db.execute(query, params);
        const [countRows] = await db.execute(countQuery, params.slice(0, -2));

        const total = Number(countRows[0]?.total || 0);

        return {
            users: rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 0
        };
    },

    create: async ({ name, email, mobile, password }) => {
        const query = `
            INSERT INTO users (name, email, mobile, password)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [name, email, mobile, password]);
        return result.insertId;
    },

    delete: async (id) => {
        const query = `
            DELETE FROM users
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
};

export default userModel;
