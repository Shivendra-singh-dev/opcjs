import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

export const getSessionUser = async (req, res) => {
    if (!req.session || !req.session.isLoggedIn || !req.session.user) {
        return res.status(401).json({
            message: "Please login first",
            user: null
        });
    }

    return res.status(200).json({
        user: req.session.user
    });
};

export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).json({
                message: "Could not logout"
            });
        }

        res.clearCookie("connect.sid");
        return res.status(200).json({
            status: "success",
            message: "Logout successful"
        });
    });
};

/**
 * LOGIN
 */
export const Login = async (req, res) => {
    try {
        const { emailOrMobile, password } = req.body;

        // 1. Validate input
        if (!emailOrMobile || !password) {
            return res.status(400).json({
                message: "Email/mobile and password are required"
            });
        }

        // 2. Find user by email or mobile
        const user = await userModel.loginUser(emailOrMobile);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 3. Verify password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // 4. Regenerate session after successful login
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regenerate error:", err);

                return res.status(500).json({
                    message: "Could not create session"
                });
            }

            // 5. Store user information in session
            req.session.user = {
                id: user.id,
                name: user.name,
                mobile: user.mobile,
                email: user.email
            };

            req.session.isLoggedIn = true;

            // 6. Save session
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);

                    return res.status(500).json({
                        message: "Could not save session"
                    });
                }

                const loggedInUser = {
                    id: user.id,
                    name: user.name,
                    mobile: user.mobile,
                    email: user.email
                };

                req.session.user = loggedInUser;
                req.session.isLoggedIn = true;

                return res.status(200).json({
                    status: "success",
                    message: "Login successful",
                    user: loggedInUser
                });
            });
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Error occurred while logging in"
        });
    }
};


/**
 * SIGNUP
 */
export const signup = async (req, res) => {
    try {
        const {
            name,
            mobile,
            email,
            password
        } = req.body;

        // 1. Validate input
        if (!name || !mobile || !email || !password) {
            return res.status(400).json({
                message: "Name, mobile, email and password are required"
            });
        }

        // 2. Check whether email already exists
        const existingEmail = await userModel.getUserByEmail(email);

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // 3. Check whether mobile already exists
        const existingMobile = await userModel.getUserByMobile(mobile);

        if (existingMobile) {
            return res.status(409).json({
                message: "Mobile number already registered"
            });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create user
        const user = await userModel.signupUser({
            name,
            mobile,
            email,
            password: hashedPassword
        });

        // 6. Response
        return res.status(201).json({
            message: "User signed up successfully",
            userId: user.id
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Error occurred while signing up"
        });
    }
};