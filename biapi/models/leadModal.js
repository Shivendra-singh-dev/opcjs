import db from "../config/db.js";

// Get all Leads
const getAllLeads = async () => {
    const [rows] = await db.query(` SELECT * FROM leads WHERE deleted_at IS NULL ORDER BY id DESC`);
    return rows;
};

// Get Lead by ID
const getLeadById = async (id) => {
    const [rows] = await db.query(` SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [id]);
    return rows[0];
};

// Create Lead
const createLead = async (data) => {
    const { name, email, mobile, address} = data;
    const [result] = await db.query(` INSERT INTO leads ( name, email, mobile, address ) VALUES (?, ?, ?, ?)`, [ name, email, mobile, address]);
    return { id: result.insertId, ...data};
};

// Create Customer Lead
const createCustomerLead = async (data) => {
    const { lead_type, lead_unique_id, name, email, mobile, address, meta} = data;
    const [result] = await db.query(` INSERT INTO leads (lead_type,lead_unique_id,name, email,mobile,address,meta ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [ lead_type, lead_unique_id, name, email, mobile, address, meta ? JSON.stringify(meta) : null]);
    return { id: result.insertId, ...data};
};

export default {getAllLeads,getLeadById,createLead,createCustomerLead};
