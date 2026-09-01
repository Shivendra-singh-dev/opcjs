import bcrypt from "bcryptjs";
import db from "../config/db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicUploadsDir = path.join(__dirname, "..", "public", "uploads");
const uploadDir = path.join(publicUploadsDir, "profile");

// Ensure uploads directory exists
try {
  await fs.mkdir(uploadDir, { recursive: true });
} catch (err) {
  console.error("Error creating uploads directory:", err);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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

// Helper: validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper: validate mobile number
const isValidMobile = (mobile) => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
};

// Helper: get user by ID with proper error handling
const getUserById = async (id) => {
  try {
    const [users] = await db.query(
      `SELECT 
        id, name, email, mobile, role, status, 
        profile_picture, address, city, state, 
        zip_code, country, created_at, updated_at 
      FROM users WHERE id = ?`,
      [id]
    );
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw error;
  }
};

// Helper: get all users with pagination
const getAllUsersPaginated = async (page = 1, limit = 10, search = '') => {
  try {
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        id, name, email, mobile, role, status, 
        profile_picture, address, city, state, 
        zip_code, country, created_at, updated_at 
      FROM users
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const params = [];
    
    if (search) {
      const searchCondition = ` WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?`;
      query += searchCondition;
      countQuery += searchCondition;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [users] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, params.slice(0, -2));
    
    return {
      users,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  } catch (error) {
    console.error("Get all users paginated error:", error);
    throw error;
  }
};

// Controllers

// POST /api/users - Create new user (signup)
export const createUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  // Validation
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ 
      error: "All fields are required",
      fields: { name, email, mobile, password: password ? 'provided' : 'missing' }
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!isValidMobile(mobile)) {
    return res.status(400).json({ error: "Mobile number must be 10 digits" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Check if email or mobile already exists
    const [existing] = await db.query(
      "SELECT id, email, mobile FROM users WHERE email = ? OR mobile = ?",
      [email, mobile]
    );

    if (existing.length > 0) {
      const existingField = existing[0].email === email ? 'email' : 'mobile';
      return res.status(400).json({ 
        error: `${existingField.charAt(0).toUpperCase() + existingField.slice(1)} already exists`,
        field: existingField
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)",
      [name.trim(), email.toLowerCase(), mobile, hashedPassword]
    );

    const newUser = await getUserById(result.insertId);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: cleanUser(newUser)
    });
  } catch (err) {
    console.error("Create user error:", err);
    return res.status(500).json({ 
      error: "Database error",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// POST /api/users/login - Login
export const loginUser = async (req, res) => {
  const { emailOrMobile, password } = req.body;

  if (!emailOrMobile || !password) {
    return res.status(400).json({ 
      error: "Email/Mobile and password are required" 
    });
  }

  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [emailOrMobile.toLowerCase(), emailOrMobile]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        error: "Invalid credentials",
        message: "No account found with this email or mobile number"
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ 
        error: "Account is disabled",
        message: "Your account has been disabled. Please contact administrator."
      });
    }

    // Generate JWT token (if you're using JWT)
    // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: cleanUser(user),
      // token: token // Uncomment if using JWT
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ 
      error: "Database error",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// GET /api/users - List all users with pagination
export const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  try {
    const result = await getAllUsersPaginated(page, limit, search);
    
    return res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
        hasNext: result.page < result.totalPages,
        hasPrev: result.page > 1
      }
    });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ 
      error: "Database error",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// GET /api/users/:id - Get single user
export const getUserByIdHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ 
      error: "Database error",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// GET /api/users/profile/:id - Get user profile (same as getUserById)
export const getUserProfile = async (req, res) => {
  // Use the same logic as getUserByIdHandler
  await getUserByIdHandler(req, res);
};

// PUT /api/users/:id/profile - Update user profile
export const  updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, address, city, state, zip_code, country, email, mobile } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Email and mobile are immutable - validate they match if provided
    if (email !== undefined && email !== user.email) {
      return res.status(400).json({
        error: "Email cannot be changed",
        field: "email",
        message: "Primary email address is immutable. Contact support to change your email."
      });
    }

    if (mobile !== undefined && mobile !== user.mobile) {
      return res.status(400).json({
        error: "Mobile number cannot be changed",
        field: "mobile",
        message: "Primary mobile number is immutable. Contact support to change your mobile number."
      });
    }

    // Build update fields
    const updateFields = {};
    const allowedFields = ["name", "address", "city", "state", "zip_code", "country"];

    if (name !== undefined && name.trim() !== "") updateFields.name = name.trim();
    if (address !== undefined) updateFields.address = address.trim();
    if (city !== undefined) updateFields.city = city.trim();
    if (state !== undefined) updateFields.state = state.trim();
    if (zip_code !== undefined) updateFields.zip_code = zip_code.trim();
    if (country !== undefined) updateFields.country = country.trim();

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

    const updatedUser = await getUserById(id);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ 
      error: "Database error",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// PUT /api/users/:id/profile/image - Update profile picture
export const updateProfileImage = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  // Use multer to handle file upload
  upload.single("profile_picture")(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          error: `Upload error: ${err.message}`,
          code: err.code
        });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    try {
      const user = await getUserById(id);
      if (!user) {
        // Delete uploaded file if user not found
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting file:", unlinkError);
        }
        return res.status(404).json({ error: "User not found" });
      }

      // Delete old profile picture if exists
      if (user.profile_picture) {
        const oldImageRelative = user.profile_picture.replace(/^\//, "");
        const oldImagePath = path.join(__dirname, "..", "public", oldImageRelative);
        try {
          await fs.unlink(oldImagePath);
        } catch (unlinkError) {
          console.error("Error deleting old profile picture:", unlinkError);
        }
      }

      // Store public URL to file in the profile folder
      const imageUrl = `/uploads/profile/${req.file.filename}`;

      await db.query(
        "UPDATE users SET profile_picture = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [imageUrl, id]
      );

      return res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        data: { profile_picture: imageUrl }
      });
    } catch (dbErr) {
      console.error("Update image error:", dbErr);
      // Delete uploaded file on database error
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file on db error:", unlinkError);
      }
      return res.status(500).json({ 
        error: "Database error",
        message: process.env.NODE_ENV === 'development' ? dbErr.message : undefined
      });
    }
  });
};

// PUT /api/users/:id - Update user role (admin only)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const validRoles = ['user', 'admin', 'moderator'];
  const validStatuses = ['active', 'inactive', 'suspended'];

  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ 
      error: "Invalid role",
      validRoles 
    });
  }

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: "Invalid status",
      validStatuses 
    });
  }

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateFields = {};
    if (role !== undefined) updateFields.role = role;
    if (status !== undefined) updateFields.status = status;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const setClauses = Object.keys(updateFields)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updateFields);

    await db.query(
      `UPDATE users SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    const updatedUser = await getUserById(id);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ 
      error: "Database error",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// PUT /api/users/:id/password - Change password
export const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      error: "Current password and new password are required" 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      error: "New password must be at least 6 characters" 
    });
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

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ 
      error: "Database error",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// DELETE /api/users/:id - Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete profile picture if exists
    if (user.profile_picture) {
      const imagePath = path.join(uploadDir, path.basename(user.profile_picture));
      try {
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.error("Error deleting profile picture:", unlinkError);
      }
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ 
      error: "Database error",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export default {
  createUser,
  loginUser,
  getAllUsers,
  getUserByIdHandler,
  getUserProfile,
  updateUserProfile,
  updateProfileImage,
  updateUser,
  changePassword,
  deleteUser
};

export { upload };