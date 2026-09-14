import db from "../config/database.js";

const createContacts = async (data) => {
    const [result] = await db.query('INSERT INTO contacts (name, mobile, email, message) VALUES (?, ?, ?, ?)',[data.name, data.mobile, data.email, data.message]);
    return { id: result.insertId, ...data };
};

const getContacts = async () => {
    const [rows] = await db.query('SELECT * FROM contacts');
    return rows;
}   


export default {createContacts, getContacts };