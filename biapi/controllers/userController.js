import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import users from "../models/userModel.js";
import env from "dotenv";

env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// Upload directories
// ======================================================

const publicUploadsDir = path.join(
  __dirname,
  "..",
  "public",
  "uploads"
);

const uploadDir = path.join(
  publicUploadsDir,
  "profile"
);

// Create upload directory when server starts
try {
  await fs.mkdir(uploadDir, { recursive: true });
} catch (err) {
  console.error("Error creating uploads directory:", err);
}

// ======================================================
// Multer Configuration
// ======================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    cb(
      null,
      `profile-${uniqueSuffix}${ext}`
    );
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const allowedExtensions = [
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".webp",
];

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    const isValidExtension =
      allowedExtensions.includes(ext);

    const isValidMimeType =
      allowedMimeTypes.includes(file.mimetype);

    if (isValidExtension && isValidMimeType) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only image files (jpeg, jpg, png, gif, webp) are allowed"
      )
    );
  },
});

// ======================================================
// Helpers
// ======================================================

const cleanUser = (user) => {
  if (!user) return null;

  const userObject =
    typeof user.toJSON === "function"
      ? user.toJSON()
      : { ...user };

  // Never expose password-related fields
  delete userObject.password;
  delete userObject.password_hash;
  delete userObject.passwordHash;

  return userObject;
};

const isValidEmail = (email) => {
  if (typeof email !== "string") return false;

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
};

const isValidMobile = (mobile) => {
  if (typeof mobile !== "string") return false;

  const mobileRegex = /^[0-9]{10}$/;

  return mobileRegex.test(mobile.trim());
};

const isValidId = (id) => {
  if (id === undefined || id === null) {
    return false;
  }

  const numericId = Number(id);

  return (
    Number.isInteger(numericId) &&
    numericId > 0
  );
};

const getErrorMessage = (err) => {
  if (process.env.NODE_ENV === "development") {
    return err?.message;
  }

  return undefined;
};

const deleteFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (err) {
    // File does not exist - nothing to do
    if (err.code !== "ENOENT") {
      console.error(
        "Error deleting file:",
        err
      );
    }
  }
};

const getProfileImagePath = (profilePicture) => {
  if (!profilePicture) return null;

  const filename = path.basename(
    profilePicture
  );

  return path.join(
    uploadDir,
    filename
  );
};

// ======================================================
// POST /api/users
// Create User
// ======================================================

export const createUser = async (req, res) => {
  let {
    name,
    email,
    mobile,
    password,
  } = req.body;

  // Validate types first
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof mobile !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  // Normalize BEFORE validation
  name = name.trim();
  email = email.trim().toLowerCase();
  mobile = mobile.trim();

  if (
    !name ||
    !email ||
    !mobile ||
    !password
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  if (!isValidMobile(mobile)) {
    return res.status(400).json({
      error: "Mobile number must be 10 digits",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error:
        "Password must be at least 6 characters",
    });
  }

  try {
    const existingUser =
      await users.findByEmailOrMobile(
        email,
        mobile
      );

    if (existingUser) {
      const existingField =
        existingUser.email === email
          ? "email"
          : "mobile";

      return res.status(409).json({
        error:
          existingField === "email"
            ? "Email already exists"
            : "Mobile already exists",
        field: existingField,
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const userId = await users.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    const newUser =
      await users.findById(userId);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: cleanUser(newUser),
    });
  } catch (err) {
    console.error(
      "Create user error:",
      err
    );

    return res.status(500).json({
      error: "Database error",
      message: getErrorMessage(err),
    });
  }
};

// ======================================================
// POST /api/users/login
// Login
// ======================================================

export const loginUser = async (req, res) => {
  let {
    emailOrMobile,
    password,
  } = req.body;

  if (
    typeof emailOrMobile !== "string" ||
    typeof password !== "string" ||
    !emailOrMobile.trim() ||
    !password
  ) {
    return res.status(400).json({
      error:
        "Email/Mobile and password are required",
    });
  }

  try {
    const value =
      emailOrMobile.trim();

    const normalizedEmail =
      value.toLowerCase();

    const normalizedMobile = value;

    const user =
      await users.findByEmailOrMobile(
        normalizedEmail,
        normalizedMobile
      );

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        error: "Account is disabled",
        message:
          "Your account has been disabled. Please contact administrator.",
      });
    }

    if (!user.password) {
      return res.status(500).json({
        error:
          "User password is not available",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: cleanUser(user),
    });
  } catch (err) {
    console.error(
      "Login error:",
      err
    );

    return res.status(500).json({
      error: "Database error",
      message: getErrorMessage(err),
    });
  }
};

// ======================================================
// GET /api/users
// Get All Users
// ======================================================

export const getAllUsers = async (req, res) => {
  const page = Math.max(
    parseInt(req.query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      parseInt(req.query.limit, 10) || 10,
      1
    ),
    100
  );

  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim()
      : "";

  try {
    const result =
      await users.findAll({
        page,
        limit,
        search,
      });

    return res.status(200).json({
      success: true,
      data: result.users,

      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
        hasNext:
          result.page < result.totalPages,
        hasPrev:
          result.page > 1,
      },
    });
  } catch (err) {
    console.error(
      "Get users error:",
      err
    );

    return res.status(500).json({
      error: "Database error",
      message: getErrorMessage(err),
    });
  }
};

// ======================================================
// GET /api/users/:id
// Get Single User
// ======================================================

export const getUserByIdHandler = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  try {
    const user =
      await users.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cleanUser(user),
    });
  } catch (err) {
    console.error(
      "Get user error:",
      err
    );

    return res.status(500).json({
      error: "Database error",
      message: getErrorMessage(err),
    });
  }
};

// ======================================================
// GET /api/users/profile/:id
// Get User Profile
// ======================================================

export const getUserProfile = async (
  req,
  res
) => {
  return getUserByIdHandler(req, res);
};

// ======================================================
// PUT /api/users/:id/profile
// Update User Profile
// ======================================================

export const updateUserProfile = async (
  req,
  res
) => {
  const { id } = req.params;

  const {
    name,
    address,
    city,
    state,
    zip_code,
    country,
    email,
    mobile,
  } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  try {
    const user =
      await users.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // ------------------------------------------
    // Email cannot be changed
    // ------------------------------------------

    if (email !== undefined) {
      if (typeof email !== "string") {
        return res.status(400).json({
          error: "Invalid email",
          field: "email",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      if (
        normalizedEmail !==
        String(user.email).toLowerCase()
      ) {
        return res.status(400).json({
          error: "Email cannot be changed",
          field: "email",
          message:
            "Primary email address is immutable. Contact support to change your email.",
        });
      }
    }

    // ------------------------------------------
    // Mobile cannot be changed
    // ------------------------------------------

    if (mobile !== undefined) {
      if (typeof mobile !== "string") {
        return res.status(400).json({
          error:
            "Invalid mobile number",
          field: "mobile",
        });
      }

      const normalizedMobile =
        mobile.trim();

      if (
        normalizedMobile !==
        String(user.mobile)
      ) {
        return res.status(400).json({
          error:
            "Mobile number cannot be changed",
          field: "mobile",
          message:
            "Primary mobile number is immutable. Contact support to change your mobile number.",
        });
      }
    }

    const updateData = {};

    if (name !== undefined) {
      if (typeof name !== "string") {
        return res.status(400).json({
          error: "Invalid name",
        });
      }

      const value = name.trim();

      if (value) {
        updateData.name = value;
      }
    }

    const stringFields = {
      address,
      city,
      state,
      zip_code,
      country,
    };

    for (const [field, value] of Object.entries(
      stringFields
    )) {
      if (value !== undefined) {
        if (typeof value !== "string") {
          return res.status(400).json({
            error: `Invalid ${field}`,
            field,
          });
        }

        updateData[field] =
          value.trim();
      }
    }

    if (
      Object.keys(updateData).length === 0
    ) {
      return res.status(400).json({
        error:
          "No valid fields to update",
      });
    }

    await users.update(
      id,
      updateData
    );

    const updatedUser =
      await users.findById(id);

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      data: cleanUser(updatedUser),
    });
  } catch (err) {
    console.error(
      "Update profile error:",
      err
    );

    return res.status(500).json({
      error: "Database error",
      message: getErrorMessage(err),
    });
  }
};

// ======================================================
// PUT /api/users/:id/profile/image
// Update Profile Picture
// ======================================================

export const updateProfileImage = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  upload.single("profile_picture")(
    req,
    res,
    async (err) => {
      if (err) {
        if (
          err instanceof multer.MulterError
        ) {
          return res.status(400).json({
            error: `Upload error: ${err.message}`,
            code: err.code,
          });
        }

        return res.status(400).json({
          error:
            err?.message ||
            "Image upload failed",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error:
            "No image file provided",
        });
      }

      try {
        const user =
          await users.findById(id);

        // User doesn't exist
        if (!user) {
          await deleteFile(
            req.file.path
          );

          return res.status(404).json({
            error: "User not found",
          });
        }

        const imageUrl =
          `/uploads/profile/${req.file.filename}`;

        // Update database first
        await users.update(id, {
          profile_picture: imageUrl,
        });

        // Delete old image only after DB update
        if (user.profile_picture) {
          const oldImagePath =
            getProfileImagePath(
              user.profile_picture
            );

          if (oldImagePath) {
            await deleteFile(
              oldImagePath
            );
          }
        }

        return res.status(200).json({
          success: true,
          message:
            "Profile picture updated successfully",
          data: {
            profile_picture:
              imageUrl,
          },
        });
      } catch (err) {
        console.error(
          "Update image error:",
          err
        );

        // Remove newly uploaded file
        await deleteFile(
          req.file.path
        );

        return res.status(500).json({
          error: "Database error",
          message:
            getErrorMessage(err),
        });
      }
    }
  );
};

// ======================================================
// PUT /api/users/:id
// Update Role / Status
// ======================================================

export const updateUser = async (
  req,
  res
) => {
  const { id } = req.params;

  const {
    role,
    status,
  } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  const validRoles = [
    "user",
    "admin",
    "moderator",
  ];

  const validStatuses = [
    "active",
    "inactive",
    "suspended",
  ];

  if (
    role !== undefined &&
    !validRoles.includes(role)
  ) {
    return res.status(400).json({
      error: "Invalid role",
      validRoles,
    });
  }

  if (
    status !== undefined &&
    !validStatuses.includes(status)
  ) {
    return res.status(400).json({
      error: "Invalid status",
      validStatuses,
    });
  }

  try {
    const user =
      await users.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const updateData = {};

    if (role !== undefined) {
      updateData.role = role;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (
      Object.keys(updateData).length === 0
    ) {
      return res.status(400).json({
        error:
          "No valid fields to update",
      });
    }

    await users.update(
      id,
      updateData
    );

    const updatedUser =
      await users.findById(id);

    return res.status(200).json({
      success: true,
      message:
        "User updated successfully",
      data: cleanUser(updatedUser),
    });
  } catch (err) {
    console.error(
      "Update user error:",
      err
    );

    return res.status(500).json({
      error: "Database error",
      message: getErrorMessage(err),
    });
  }
};

// ======================================================
// PUT /api/users/:id/password
// Change Password
// ======================================================

export const changePassword = async (
  req,
  res
) => {
  const { id } = req.params;

  const {
    currentPassword,
    newPassword,
  } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    !currentPassword ||
    !newPassword
  ) {
    return res.status(400).json({
      error:
        "Current password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      error:
        "New password must be at least 6 characters",
    });
  }

  try {
    const user =
      await users.findByIdWithPassword(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (!user.password) {
      return res.status(500).json({
        error:
          "User password is not available",
      });
    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        error:
          "Current password is incorrect",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    await users.update(id, {
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (err) {
    console.error(
      "Change password error:",
      err
    );

    return res.status(500).json({
      error: "Database error",
      message: getErrorMessage(err),
    });
  }
};

// ======================================================
// DELETE /api/users/:id
// Delete User
// ======================================================

export const deleteUser = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  try {
    const user =
      await users.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Delete profile picture
    if (user.profile_picture) {
      const imagePath =
        getProfileImagePath(
          user.profile_picture
        );

      if (imagePath) {
        await deleteFile(
          imagePath
        );
      }
    }

    await users.delete(id);

    return res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });
  } catch (err) {
    console.error(
      "Delete user error:",
      err
    );

    return res.status(500).json({
      error: "Database error",
      message: getErrorMessage(err),
    });
  }
};

// ======================================================
// Exports
// ======================================================

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
  deleteUser,
};

export { upload };
