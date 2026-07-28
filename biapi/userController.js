import bcrypt from "bcryptjs";
import db, { callbackDb } from "./db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "profile-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed"));
  },
});

// Helper: clean user object (remove password)
const cleanUser = (user) => {
  if (!user) return null;
  const { password, ...userData } = user;
  return userData;
};

// POST /api/users - Create new user (signup)
const createUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if email or mobile already exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? OR mobile = ?",
      [email, mobile]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email or mobile already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)",
      [name, email, mobile, hashedPassword]
    );

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: result.insertId,
        name,
        email,
        mobile,
        role: "user",
        status: "active",
      },
    });
  } catch (err) {
    console.error("Create user error:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

// POST /api/users/login - Login (supports email OR mobile)
const loginUser = async (req, res) => {
  const { emailOrMobile, password } = req.body;

  if (!emailOrMobile || !password) {
    return res.status(400).json({ error: "Email/Mobile and password are required" });
  }

  try {
    // Support login by email OR mobile number
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [emailOrMobile, emailOrMobile]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email/mobile or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email/mobile or password" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ error: "Account is disabled. Contact administrator." });
    }

    return res.status(200).json({
      message: "Login successful",
      user: cleanUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

// GET /api/users - List all users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, mobile, role, status, profile_picture, address, city, state, zip_code, country, created_at, updated_at FROM users"
    );
    return res.status(200).json(users);
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

// GET /api/users/:id - Get single user
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      "SELECT id, name, email, mobile, role, status, profile_picture, address, city, state, zip_code, country, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(users[0]);
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

// PUT /api/users/:id/profile - Update user profile (name, address, image)
// Email and mobile are NOT allowed to be changed here (validated on backend)
const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, address, city, state, zip_code, country, email, mobile } = req.body;

  // Validate user exists
  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    // Build update fields (only allowed fields)
    const updateFields = {};
    const allowedFields = ["name", "address", "city", "state", "zip_code", "country"];

    if (name !== undefined && name.trim() !== "") updateFields.name = name.trim();
    if (address !== undefined) updateFields.address = address;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (zip_code !== undefined) updateFields.zip_code = zip_code;
    if (country !== undefined) updateFields.country = country;

    // Email and mobile are immutable - validate they match if provided
    if (email !== undefined && email !== user.email) {
      return res.status(400).json({
        error: "Email cannot be changed",
        field: "email",
        message: "Primary email address is immutable. Contact support to change your email.",
      });
    }

    if (mobile !== undefined && mobile !== user.mobile) {
      return res.status(400).json({
        error: "Mobile number cannot be changed",
        field: "mobile",
        message: "Primary mobile number is immutable. Contact support to change your mobile number.",
      });
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    // Build dynamic SQL
    const setClauses = Object.keys(updateFields)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updateFields);

    await db.query(
      `UPDATE users SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    // Fetch updated user
    const [updatedUsers] = await db.query(
      "SELECT id, name, email, mobile, role, status, profile_picture, address, city, state, zip_code, country, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUsers[0],
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

// PUT /api/users/:id/profile/image - Update profile picture
const updateProfileImage = async (req, res) => {
  const { id } = req.params;

  // Use multer to handle file upload
  upload.single("profile_picture")(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    try {
      const [users] = await db.query("SELECT id FROM users WHERE id = ?", [id]);
      if (users.length === 0) {
        // Delete uploaded file if user not found
        const fs = await import("fs");
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: "User not found" });
      }

      // Store relative path or filename
      const imageUrl = `/uploads/${req.file.filename}`;

      await db.query(
        "UPDATE users SET profile_picture = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [imageUrl, id]
      );

      return res.status(200).json({
        message: "Profile picture updated successfully",
        profile_picture: imageUrl,
      });
    } catch (dbErr) {
      console.error("Update image error:", dbErr);
      return res.status(500).json({ error: "Database error" });
    }
  });
};

// PUT /api/users/:id - Update user (existing, kept for admin role updates)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

// PUT /api/users/:id/password - Change password
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, id]
    );

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

// DELETE /api/users/:id - Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

// Main router handler for backward compatibility with existing routes
const userController = async (req, res) => {
  // Route to the appropriate handler based on method and URL pattern
  const path = req.path || "";
  const isLogin = path === "/login" || req.url === "/login";
  const isProfileUpdate = path.includes("/profile") && !path.includes("/image");
  const isProfileImage = path.includes("/profile/image");
  const isPasswordChange = path.includes("/password");
  const hasId = req.params && req.params.id;

  if (req.method === "POST" && isLogin) {
    return loginUser(req, res);
  }

  if (req.method === "POST" && !isLogin) {
    return createUser(req, res);
  }

  if (req.method === "GET" && hasId) {
    return getUserById(req, res);
  }

  if (req.method === "GET") {
    return getAllUsers(req, res);
  }

  if (req.method === "PUT" && isPasswordChange && hasId) {
    return changePassword(req, res);
  }

  if (req.method === "PUT" && isProfileImage && hasId) {
    return updateProfileImage(req, res);
  }

  if (req.method === "PUT" && isProfileUpdate && hasId) {
    return updateUserProfile(req, res);
  }

  if (req.method === "PUT" && hasId) {
    return updateUser(req, res);
  }

  if (req.method === "DELETE" && hasId) {
    return deleteUser(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default userController;
export { upload };
