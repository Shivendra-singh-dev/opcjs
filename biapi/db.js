import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'opc_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to use promises (for async/await controllers)
const db = pool.promise();

// Keep the callback-based pool for legacy controllers (userController, Product)
export const callbackDb = pool;

// Auto-create tables function
const initializeDatabase = async () => {
    try {
        // Test connection
        const connection = await db.getConnection();
        console.log('✓ Connected to MySQL Database');
        connection.release();

        // Create contacts table if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                mobile VARCHAR(20) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
        console.log('✓ Contacts table ready');

        // Create users table if it doesn't exist (for signup)
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                mobile VARCHAR(20) NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                otp VARCHAR(10) DEFAULT NULL,
                status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
        console.log('✓ Users table ready');

    } catch (err) {
        console.error('✗ Database initialization failed:', err.message);
        console.error('Please ensure MySQL is running and the database exists.');
        console.error(`Run: CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'opc_db'};`);
    }
};

// Initialize tables
initializeDatabase();

export default db;
