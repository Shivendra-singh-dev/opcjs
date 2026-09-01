import db from "../config/db.js";
import bcrypt from "bcrypt";

const userModel = {
    // Login: find user by email OR mobile
    loginUser: async (emailOrMobile) => {
        const query = `
            SELECT id, name, mobile, email, password
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
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        const values = [
            userData.name,
            userData.email,
            hashedPassword
        ];

        const [result] = await db.execute(query, values);

        return {
            id: result.insertId,
            name: userData.name,
            email: userData.email
        };
    },

    // Get user by ID
    getUserById: async (id) => {
        const query = `
            SELECT id, name, mobile, email
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
            SELECT id, name, mobile, email
            FROM users
            ORDER BY id DESC
        `;

        const [rows] = await db.execute(query);

        return rows;
    }
};

export default userModel;
