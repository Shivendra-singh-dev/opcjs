import db from "../config/database.js";

const Pancard = {

    // Get all pancards
    async getAll() {
        const [rows] = await db.query(` SELECT * FROM pancards WHERE deleted_at IS NULL ORDER BY id DESC`);
        return rows;
    },

    // Get pancard by ID
    async getById(id) {
        const [rows] = await db.query(` SELECT * FROM pancards WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [id]);
        return rows[0];
    },

    // Create pancard
    async create(data) {
        const {  sponsor_id, ref_code, pan_type, pan_number, name, mobile, email, address, profile_image, front_aadhar_image, back_aadhar_image, profile_signature, password, otp, otp_expiry, last_login_at, generated_image, is_verified, status} = data;

        const [result] = await db.query(` INSERT INTO pancards (sponsor_id,ref_code,pan_type,pan_number,name,mobile,email,address,profile_image,front_aadhar_image,back_aadhar_image,profile_signature,password,otp,otp_expiry,last_login_at,generated_image,is_verified,status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [sponsor_id, ref_code, pan_type, pan_number, name, mobile, email, address, profile_image, front_aadhar_image, back_aadhar_image, profile_signature, password, otp, otp_expiry, last_login_at, generated_image, is_verified ?? false, status ?? "active"]);

        return { id: result.insertId, ...data, is_verified: is_verified ?? false, status: status ?? "active"};
    },

    // Update pancard
    async update(id, data) {
        const { sponsor_id, ref_code, pan_type, pan_number, name, mobile, email, address, profile_image, front_aadhar_image, back_aadhar_image, profile_signature, password, otp, otp_expiry, last_login_at, generated_image, is_verified, status} = data;
        const [result] = await db.query(` UPDATE pancards SET  sponsor_id = ?,  ref_code = ?,  pan_type = ?,  pan_number = ?,  name = ?,  mobile = ?,  email = ?,  address = ?,  profile_image = ?,  front_aadhar_image = ?,  back_aadhar_image = ?,  profile_signature = ?,  password = ?,  otp = ?,  otp_expiry = ?,  last_login_at = ?,  generated_image = ?,  is_verified = ?,  status = ? WHERE id = ?`, [ sponsor_id, ref_code, pan_type, pan_number, name, mobile, email, address, profile_image, front_aadhar_image, back_aadhar_image, profile_signature, password, otp, otp_expiry, last_login_at, generated_image, is_verified, status, id]);
        return result;
    },

    // Soft delete
    async delete(id) {
        const [result] = await db.query(` UPDATE pancards SET deleted_at = NOW() WHERE id = ?`, [id]);
        return result;
    }
};

export default Pancard;
