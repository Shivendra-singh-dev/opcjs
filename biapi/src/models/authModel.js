import db from "../config/database.js";
import bcrypt from "bcryptjs";

const authModal = {
    loginUser: async (emailOrMobile) => {
        const query = `
            SELECT id, name, mobile, email, password, role, status
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
            email: userData.email,
            role: "user",
            status: "active"
        };
    },

    getUserByEmail: async (email) => {
        const [rows] = await db.execute(
            `SELECT id, email, status FROM users WHERE email = ? LIMIT 1`,
            [email]
        );

        return rows.length > 0 ? rows[0] : null;
    },

    getUserByMobile: async (mobile) => {
        const [rows] = await db.execute(
            `SELECT id, mobile FROM users WHERE mobile = ? LIMIT 1`,
            [mobile]
        );

        return rows.length > 0 ? rows[0] : null;
    }
};

export default authModal;
