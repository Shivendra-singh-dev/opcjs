import argon2 from "argon2";
import db from "../config/database.js";

export const getSlib = async (req, res) => {
  try {
    const [data] = await db.query("SELECT name,email,mobile,address,status,last_login,photo,created_at FROM slib_users");

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log("MySQL Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
      error: err.message,
    });
  }
};

export const getViewSlib = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({success: false,message: "ID is required"});
        }

        const [rows] = await db.execute("SELECT name, email, mobile, address FROM slib_users WHERE id = ?",[id]);

        if (rows.length > 0) {
            return res.status(200).json({success: true,message: "View Record Success",data: rows[0]});
        } else {
            return res.status(404).json({success: false,message: "Record Not Found"});
        }

    } catch (err) {
        return res.status(500).json({success: false,message: "Something went wrong",error: err.message});
    }
};

export const createSlib = async (req, res) => {
  try {
    const { name, mobile, email, address, password } = req.body;
    // Hash password
    const passwordHash = await argon2.hash(password);
    const [data] = await db.execute("INSERT INTO slib_users (name, mobile, email,address,password_hash) VALUES (?, ?, ?, ?, ?)", [name, mobile, email, address, passwordHash]);
    return res.status(200).json({
      success: true, message: 'Record saved successfully', data: {
        id: data.insertId,
        name,
        mobile,
        email,
        address,
        passwordHash
      },
    });
  } catch (err) {
    console.error("MySQL Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to save record",
      error: err.message
    });
  }
};

export const updateSlib = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, address,password } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "ID is required" });
    }
    const passwordHash = await argon2.hash(password);
    const [result] = await db.execute("UPDATE slib_users SET name = ?, mobile = ?, email = ?, address = ?, password_hash = ? WHERE id = ?", [name, mobile, email, address, passwordHash, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    return res.status(200).json({ success: true, message: "Record updated successfully" });
  } catch (err) {
    console.error("MySQL Error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
  }
};

export const deleteSlib = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "ID is required", });
    }

    const [result] = await db.execute("DELETE FROM slib_users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Record not found", });
    }
    return res.status(200).json({ success: true, message: "Record deleted successfully", });
  } catch (err) {
    console.error("MySQL Error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
  }
};

