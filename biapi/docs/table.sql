CREATE TABLE qns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    question_type ENUM('descriptive','mcq') NOT NULL,
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    option_d VARCHAR(255),
    correct_answer TEXT,
    description TEXT,
    youtube_url VARCHAR(500),
    status ENUM('Active','Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE qns ADD COLUMN descriptive_answer VARCHAR(500) AFTER description;
ALTER TABLE qns ADD COLUMN thumbnail_url VARCHAR(500) AFTER youtube_url;