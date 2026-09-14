-- Initial database schema for biapi.
-- Apply with: mysql -u <user> -p <database> < database/migrations/001_initial_schema.sql

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    profile_picture VARCHAR(500),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(30),
    email VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_type VARCHAR(100),
    lead_unique_id VARCHAR(150),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(30),
    address VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    meta JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS pancards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sponsor_id INT NULL,
    ref_code VARCHAR(100),
    pan_type VARCHAR(50),
    pan_number VARCHAR(30),
    name VARCHAR(150),
    mobile VARCHAR(30),
    email VARCHAR(255),
    address VARCHAR(255),
    profile_image VARCHAR(500),
    front_aadhar_image VARCHAR(500),
    back_aadhar_image VARCHAR(500),
    profile_signature VARCHAR(500),
    password VARCHAR(255),
    otp VARCHAR(20),
    otp_expiry DATETIME NULL,
    last_login_at DATETIME NULL,
    generated_image VARCHAR(500),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS qns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL DEFAULT 'objective',
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    option_d VARCHAR(255),
    correct_answer TEXT,
    description TEXT,
    descriptive_answer VARCHAR(500),
    youtube_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sliders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100),
    title VARCHAR(255),
    sub_title VARCHAR(255),
    description TEXT,
    image VARCHAR(500),
    url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100),
    title VARCHAR(255),
    sub_title VARCHAR(255),
    description TEXT,
    image VARCHAR(500),
    url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS socialmedia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100),
    title VARCHAR(255),
    sub_title VARCHAR(255),
    url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bigsell (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(150),
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
    url VARCHAR(500),
    price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS slib_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(30),
    address VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    last_login DATETIME NULL,
    photo VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
