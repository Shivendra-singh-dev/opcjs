import { callbackDb } from '../db.js';
const db = callbackDb;

// Get all products
export const getAllProducts = (callback) => {
    const query = 'SELECT * FROM products';
    db.query(query, callback);
};

// Get single product by ID
export const getProductById = (id, callback) => {
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [id], callback);
};

// Create new product
export const createProduct = (productData, callback) => {
    const query = 'INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)';
    const values = [productData.name, productData.description, productData.price, productData.quantity];
    db.query(query, values, callback);
};

// Update product
export const updateProduct = (id, productData, callback) => {
    const query = 'UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?';
    const values = [productData.name, productData.description, productData.price, productData.quantity, id];
    db.query(query, values, callback);
};

// Delete product
export const deleteProduct = (id, callback) => {
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], callback);
};
