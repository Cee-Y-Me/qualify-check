-- South African University Qualification Database Schema
-- This script creates the necessary tables for the university matching system

-- Create database (if using MySQL/PostgreSQL)
-- CREATE DATABASE sa_university_qualification;
-- USE sa_university_qualification;

-- Universities table
CREATE TABLE IF NOT EXISTS universities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    province VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL,
    ranking INTEGER,
    website VARCHAR(255),
    description TEXT,
    faculties JSON,
    fees JSON,
    requirements JSON,
    contact JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    university_id VARCHAR(50) NOT NULL,
    university_name VARCHAR(255) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    degree_type VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    nqf_level INTEGER NOT NULL,
    requirements JSON NOT NULL,
    fees VARCHAR(100),
    description TEXT,
    career_prospects JSON,
    accreditation JSON,
    application_deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- Student submissions table
CREATE TABLE IF NOT EXISTS student_submissions (
    id VARCHAR(50) PRIMARY KEY,
    student_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    province VARCHAR(50),
    qualifications JSON NOT NULL,
    questionnaire_responses JSON NOT NULL,
    match_score INTEGER,
    recommended_courses JSON,
    recommended_universities JSON,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Grade 12 subjects reference table
CREATE TABLE IF NOT EXISTS grade12_subjects (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(255) NOT NULL UNIQUE,
    subject_code VARCHAR(10),
    category VARCHAR(50), -- 'compulsory', 'elective', 'specialized'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- University rankings table (for historical tracking)
CREATE TABLE IF NOT EXISTS university_rankings (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    university_id VARCHAR(50) NOT NULL,
    ranking_year INTEGER NOT NULL,
    national_ranking INTEGER,
    international_ranking INTEGER,
    ranking_source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- Course requirements mapping table
CREATE TABLE IF NOT EXISTS course_requirements (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    course_id VARCHAR(50) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    minimum_mark INTEGER NOT NULL,
    is_compulsory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create indexes for better performance
CREATE INDEX idx_universities_province ON universities(province);
CREATE INDEX idx_universities_ranking ON universities(ranking);
CREATE INDEX idx_courses_university ON courses(university_id);
CREATE INDEX idx_courses_faculty ON courses(faculty);
CREATE INDEX idx_courses_nqf_level ON courses(nqf_level);
CREATE INDEX idx_student_submissions_email ON student_submissions(email);
CREATE INDEX idx_student_submissions_created ON student_submissions(created_at);
CREATE INDEX idx_course_requirements_course ON course_requirements(course_id);
CREATE INDEX idx_course_requirements_subject ON course_requirements(subject_name);

-- Create views for common queries
CREATE VIEW university_summary AS
SELECT 
    u.id,
    u.name,
    u.location,
    u.province,
    u.type,
    u.ranking,
    COUNT(c.id) as total_courses,
    AVG(c.nqf_level) as avg_nqf_level
FROM universities u
LEFT JOIN courses c ON u.id = c.university_id
GROUP BY u.id, u.name, u.location, u.province, u.type, u.ranking;

CREATE VIEW course_summary AS
SELECT 
    c.id,
    c.name,
    c.university_name,
    c.faculty,
    c.degree_type,
    c.duration,
    c.nqf_level,
    c.fees,
    COUNT(cr.id) as requirement_count
FROM courses c
LEFT JOIN course_requirements cr ON c.id = cr.course_id
GROUP BY c.id, c.name, c.university_name, c.faculty, c.degree_type, c.duration, c.nqf_level, c.fees;
