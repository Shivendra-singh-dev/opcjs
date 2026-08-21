import db from "../config/db.js";
import bcrypt from 'bcrypt';
// import session from "express-session"; // (used for session middleware, not directly here)

export const Login = async (req, res) => {
    try {
        const { emailOrMobile, password } = req.body;

        // Find user by email or mobile
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ? OR mobile = ?",
            [emailOrMobile, emailOrMobile]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Store user details in session (use correct column name: 'name')
        req.session.user = {
            id: user.id,            // ✅'10001'+ in future use the 
            name: user.name,          // ✅ changed from user.fname
            mobile: user.mobile,
            email: user.email
        };
        req.session.isLoggedIn = true;

        // Save session before responding
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Could not create session" });
            }
            return res.status(200).json({
                message: "Login successful",
                user: req.session.user
            });
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Error occurred while logging in",
            error: err.message
        });
    }
};

export const signup = async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;

        // Check if user already exists (optional but recommended)
        const [existing] = await db.query(
            "SELECT id FROM users WHERE email = ? OR mobile = ?",
            [email, mobile]
        );
        if (existing.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hash_password = await bcrypt.hash(password, 10); // increased salt rounds for better security

        // Insert new user
        const [result] = await db.query(
            "INSERT INTO users (name, mobile, email, password) VALUES (?, ?, ?, ?)",
            [name, mobile, email, hash_password]
        );

        return res.status(201).json({
            message: "User signed up successfully",
            userId: result.insertId
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error occurred while signing up",
            error: error.message
        });
    }
};