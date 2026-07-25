import bcrypt from "bcryptjs";
import { callbackDb } from "./db.js";
const db = callbackDb;

const userController = async (req, res) => {
    if (req.method === "POST") {
        const { name, email, mobile, password } = req.body;

        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        db.query(
            "SELECT id FROM users WHERE email = ? OR mobile = ?",
            [email, mobile],
            async (err, results) => {
                if (err) {
                    return res.status(500).json({
                        error: "Database error"
                    });
                }
  
                if (results.length > 0) {
                    return res.status(400).json({
                        error: "Email or mobile already exists"
                    });
                }

                try {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    db.query(
                        "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)",
                        [name, email, mobile, hashedPassword],
                        (err) => {
                            if (err) {
                                return res.status(500).json({
                                    error: "Database error"
                                });
                            }

                            return res.status(201).json({
                                message: "User added successfully"
                            });
                        }
                    );
                } catch (error) {
                    return res.status(500).json({
                        error: "Password hashing failed"
                    });
                }
            }
        );
    }

    else if (req.method === "GET") {
        db.query(
            "SELECT id, name, email, mobile, password,role,otp,status FROM users",
            (err, results) => {
                if (err) {
                    return res.status(500).json({
                        error: "Database error"
                    });
                }

                return res.status(200).json(results);
            }
        );
    }

    else if (req.method === "PUT") {
        const { id } = req.params;
        const { email, mobile, role } = req.body;
        // Console.Log(`Updating user with ID: ${id}, Email: ${email}, Mobile: ${mobile}, Role: ${role}`);
        db.query("UPDATE users SET role=? WHERE id=?",
            [role, id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ 
                        error: "Database error"
                    });
                }
 
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        error: "User not found"
                    });
                }

                return res.status(200).json({
                    message: "User updated successfully"
                });
            }
        );
    }

    else if (req.method === "DELETE") {
        const { id } = req.params;

        db.query(
            "DELETE FROM users WHERE id=?",
            [id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: "Database error"
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        error: "User not found"
                    });
                }

                return res.status(200).json({
                    message: "User deleted successfully"
                });
            }
        );
    }

    else {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
};

export default userController;

