import bcrypt from "bcryptjs";
import authModal from "../models/authModel.js";

const toSessionUser = (user) => ({
    id: user.id,
    name: user.name,
    mobile: user.mobile,
    email: user.email,
    role: user.role || "user"
});

const saveUserSession = (req, user) => new Promise((resolve, reject) => {
    req.session.regenerate((regenerateError) => {
        if (regenerateError) return reject(regenerateError);

        req.session.user = toSessionUser(user);
        req.session.isLoggedIn = true;
        req.session.save((saveError) => {
            if (saveError) return reject(saveError);
            resolve(req.session.user);
        });
    });
});

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
    if (!req.session) {
        res.clearCookie("connect.sid", { path: "/" });
        return res.status(200).json({
            status: "success",
            message: "Logout successful"
        });
    }

    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).json({
                message: "Could not logout"
            });
        }

        res.clearCookie("connect.sid", { path: "/" });
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
        const { emailOrMobile, email, password } = req.body;
        const loginValue = emailOrMobile || email;

        if (!loginValue || !password) {
            return res.status(400).json({
                message: "Email/mobile and password are required"
            });
        }

        const user = await authModal.loginUser(loginValue);

        if (!user || (user.status && user.status !== "active")) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const loggedInUser = await saveUserSession(req, user);
        return res.status(200).json({ status: "success", message: "Login successful", user: loggedInUser });

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
        const { name, mobile, email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();
        const normalizedMobile = mobile?.trim();

        if (!name?.trim() || !normalizedMobile || !normalizedEmail || !password) {
            return res.status(400).json({
                message: "Name, mobile, email and password are required"
            });
        }

        const existingEmail = await authModal.getUserByEmail(normalizedEmail);

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // 3. Check whether mobile already exists
        const existingMobile = await authModal.getUserByMobile(normalizedMobile);

        if (existingMobile) {
            return res.status(409).json({
                message: "Mobile number already registered"
            });
        }

        // 4. Hash password
        const user = await authModal.signupUser({
            name: name.trim(),
            mobile: normalizedMobile,
            email: normalizedEmail,
            password
        });
        const sessionUser = await saveUserSession(req, user);

        return res.status(201).json({
            message: "User signed up successfully",
            user: sessionUser
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Error occurred while signing up"
        });
    }
};

export const forgotPassword = async (req, res) => {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await authModal.getUserByEmail(email);

    // Keep the response generic so account existence is not disclosed.
    if (user) {
        console.log(`Password reset requested for ${email}`);
    }

    return res.status(200).json({
        message: "If an account exists for this email, password reset instructions will be sent."
    });
};

