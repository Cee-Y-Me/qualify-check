-- Seed data for South African University Qualification Database
-- This script populates the database with initial data

-- Insert Grade 12 subjects
INSERT INTO grade12_subjects (subject_name, subject_code, category, description) VALUES
('English Home Language', 'EHL', 'compulsory', 'First language English instruction'),
('English First Additional Language', 'EFAL', 'compulsory', 'Second language English instruction'),
('Afrikaans Home Language', 'AHL', 'compulsory', 'First language Afrikaans instruction'),
('Afrikaans First Additional Language', 'AFAL', 'compulsory', 'Second language Afrikaans instruction'),
('Mathematics', 'MATH', 'compulsory', 'Pure mathematics'),
('Mathematical Literacy', 'ML', 'compulsory', 'Applied mathematics for daily life'),
('Physical Sciences', 'PS', 'elective', 'Physics and Chemistry combined'),
('Life Sciences', 'LS', 'elective', 'Biology and related life sciences'),
('Geography', 'GEO', 'elective', 'Physical and human geography'),
('History', 'HIST', 'elective', 'South African and world history'),
('Business Studies', 'BS', 'elective', 'Basic business principles'),
('Economics', 'ECON', 'elective', 'Micro and macroeconomics'),
('Accounting', 'ACC', 'elective', 'Financial and management accounting'),
('Life Orientation', 'LO', 'compulsory', 'Life skills and citizenship'),
('Information Technology', 'IT', 'specialized', 'Computer systems and programming'),
('Computer Applications Technology', 'CAT', 'specialized', 'Computer applications and digital literacy'),
('Engineering Graphics and Design', 'EGD', 'specialized', 'Technical drawing and design'),
('Visual Arts', 'VA', 'specialized', 'Fine arts and visual communication'),
('Music', 'MUS', 'specialized', 'Music theory and performance'),
('Dramatic Arts', 'DA', 'specialized', 'Theatre and performance arts');

-- Insert Universities
INSERT INTO universities (id, name, location, province, type, ranking, website, description, faculties, fees, requirements, contact) VALUES
('uct_001', 'University of Cape Town', 'Cape Town', 'Western Cape', 'Public Research University', 1, 'https://www.uct.ac.za', 
 'Africa''s leading research university with world-class facilities and programs across all major disciplines.',
 '["Commerce", "Engineering", "Health Sciences", "Humanities", "Law", "Science"]',
 '{"undergraduate": "R55,000 - R85,000", "postgraduate": "R65,000 - R120,000"}',
 '{"minimum_aps": 35, "english_requirement": 60, "mathematics_requirement": 60}',
 '{"phone": "+27 21 650 9111", "email": "admissions@uct.ac.za", "address": "Private Bag X3, Rondebosch 7701"}'),

('wits_001', 'University of the Witwatersrand', 'Johannesburg', 'Gauteng', 'Public Research University', 2, 'https://www.wits.ac.za',
 'Premier university known for excellence in engineering, medicine, business, and mining.',
 '["Commerce", "Engineering", "Health Sciences", "Humanities", "Science"]',
 '{"undergraduate": "R60,000 - R90,000", "postgraduate": "R70,000 - R130,000"}',
 '{"minimum_aps": 34, "english_requirement": 60, "mathematics_requirement": 65}',
 '{"phone": "+27 11 717 1000", "email": "admissions@wits.ac.za", "address": "1 Jan Smuts Avenue, Braamfontein 2000"}'),

('sun_001', 'Stellenbosch University', 'Stellenbosch', 'Western Cape', 'Public Research University', 3, 'https://www.sun.ac.za',
 'Renowned for agriculture, engineering, wine studies, and beautiful historic campus.',
 '["AgriSciences", "Arts", "Economic Sciences", "Education", "Engineering", "Medicine", "Science"]',
 '{"undergraduate": "R50,000 - R80,000", "postgraduate": "R60,000 - R110,000"}',
 '{"minimum_aps": 33, "english_requirement": 60, "mathematics_requirement": 60}',
 '{"phone": "+27 21 808 9111", "email": "info@sun.ac.za", "address": "Private Bag X1, Matieland 7602"}'),

('up_001', 'University of Pretoria', 'Pretoria', 'Gauteng', 'Public Research University', 4, 'https://www.up.ac.za',
 'Comprehensive university with strong veterinary, engineering, and medical programs.',
 '["Economic Sciences", "Education", "Engineering", "Health Sciences", "Humanities", "Law", "Natural Sciences", "Theology", "Veterinary Science"]',
 '{"undergraduate": "R55,000 - R85,000", "postgraduate": "R65,000 - R125,000"}',
 '{"minimum_aps": 32, "english_requirement": 60, "mathematics_requirement": 60}',
 '{"phone": "+27 12 420 3111", "email": "admissions@up.ac.za", "address": "Private Bag X20, Hatfield 0028"}'),

('ukzn_001', 'University of KwaZulu-Natal', 'Durban', 'KwaZulu-Natal', 'Public Research University', 5, 'https://www.ukzn.ac.za',
 'Leading university with strong programs in agriculture, engineering, and health sciences.',
 '["Agriculture", "Engineering", "Health Sciences", "Humanities", "Law", "Management Studies", "Science"]',
 '{"undergraduate": "R45,000 - R75,000", "postgraduate": "R55,000 - R105,000"}',
 '{"minimum_aps": 30, "english_requirement": 60, "mathematics_requirement": 60}',
 '{"phone": "+27 31 260 1111", "email": "admissions@ukzn.ac.za", "address": "Private Bag X54001, Durban 4000"}');

-- Insert Courses
INSERT INTO courses (id, name, university_id, university_name, faculty, degree_type, duration, nqf_level, requirements, fees, description, career_prospects, accreditation, application_deadline) VALUES
('course_001', 'Bachelor of Engineering (Mechanical)', 'wits_001', 'University of the Witwatersrand', 'Faculty of Engineering and the Built Environment', 'Bachelor''s Degree', '4 years', 8,
 '{"subjects": {"Mathematics": 70, "Physical Sciences": 70, "English": 60}, "minimum_aps": 36, "additional_requirements": ["National Benchmark Test (NBT)", "Strong problem-solving skills"]}',
 'R75,000 - R95,000 per year',
 'Comprehensive mechanical engineering program covering thermodynamics, fluid mechanics, materials science, and design with strong industry partnerships.',
 '["Mechanical Engineer", "Design Engineer", "Project Manager", "Manufacturing Engineer", "Consulting Engineer", "Research and Development Engineer"]',
 '["Engineering Council of South Africa (ECSA)", "Washington Accord"]',
 '2024-09-30'),

('course_002', 'Bachelor of Commerce (Accounting)', 'uct_001', 'University of Cape Town', 'Faculty of Commerce', 'Bachelor''s Degree', '3 years', 7,
 '{"subjects": {"Mathematics": 65, "English": 60, "Accounting": 60}, "minimum_aps": 35, "additional_requirements": ["National Benchmark Test (NBT)"]}',
 'R60,000 - R75,000 per year',
 'Leading commerce program with strong focus on accounting principles, financial management, and business ethics.',
 '["Chartered Accountant (CA)", "Financial Manager", "Auditor", "Tax Consultant", "Management Accountant", "Financial Analyst"]',
 '["South African Institute of Chartered Accountants (SAICA)"]',
 '2024-09-30'),

('course_003', 'Bachelor of Medicine and Bachelor of Surgery (MBChB)', 'uct_001', 'University of Cape Town', 'Faculty of Health Sciences', 'Professional Degree', '6 years', 8,
 '{"subjects": {"Mathematics": 75, "Physical Sciences": 75, "Life Sciences": 75, "English": 70}, "minimum_aps": 42, "additional_requirements": ["National Benchmark Test (NBT)", "Multiple Mini Interview (MMI)", "Community service experience preferred"]}',
 'R95,000 - R130,000 per year',
 'Prestigious medical program with world-class clinical training at Groote Schuur Hospital and associated teaching hospitals.',
 '["Medical Doctor", "Specialist Physician", "Surgeon", "Medical Researcher", "Public Health Officer", "Medical Consultant"]',
 '["Health Professions Council of South Africa (HPCSA)"]',
 '2024-08-31'),

('course_004', 'Bachelor of Science (Computer Science)', 'wits_001', 'University of the Witwatersrand', 'Faculty of Science', 'Bachelor''s Degree', '3 years', 7,
 '{"subjects": {"Mathematics": 70, "Physical Sciences": 65, "English": 60}, "minimum_aps": 34, "additional_requirements": ["National Benchmark Test (NBT)", "Logical thinking skills"]}',
 'R65,000 - R80,000 per year',
 'Cutting-edge computer science program covering software engineering, artificial intelligence, data science, and cybersecurity.',
 '["Software Developer", "Data Scientist", "Systems Analyst", "IT Consultant", "Cybersecurity Specialist", "Machine Learning Engineer"]',
 '["Computer Society of South Africa (CSSA)"]',
 '2024-09-30'),

('course_005', 'Bachelor of Agricultural Sciences', 'sun_001', 'Stellenbosch University', 'Faculty of AgriSciences', 'Bachelor''s Degree', '4 years', 8,
 '{"subjects": {"Mathematics": 65, "Physical Sciences": 65, "Life Sciences": 65, "English": 60}, "minimum_aps": 33, "additional_requirements": ["National Benchmark Test (NBT)"]}',
 'R55,000 - R70,000 per year',
 'Comprehensive agricultural program covering crop science, animal science, soil science, and agricultural economics.',
 '["Agricultural Scientist", "Farm Manager", "Agricultural Consultant", "Research Scientist", "Extension Officer", "Agricultural Economist"]',
 '["South African Council for Natural Scientific Professions (SACNASP)"]',
 '2024-09-30');

-- Insert Course Requirements (detailed breakdown)
INSERT INTO course_requirements (course_id, subject_name, minimum_mark, is_compulsory) VALUES
-- Mechanical Engineering requirements
('course_001', 'Mathematics', 70, TRUE),
('course_001', 'Physical Sciences', 70, TRUE),
('course_001', 'English Home Language', 60, TRUE),
('course_001', 'English First Additional Language', 60, FALSE),

-- Commerce Accounting requirements
('course_002', 'Mathematics', 65, TRUE),
('course_002', 'English Home Language', 60, TRUE),
('course_002', 'English First Additional Language', 60, FALSE),
('course_002', 'Accounting', 60, TRUE),

-- Medicine requirements
('course_003', 'Mathematics', 75, TRUE),
('course_003', 'Physical Sciences', 75, TRUE),
('course_003', 'Life Sciences', 75, TRUE),
('course_003', 'English Home Language', 70, TRUE),
('course_003', 'English First Additional Language', 70, FALSE),

-- Computer Science requirements
('course_004', 'Mathematics', 70, TRUE),
('course_004', 'Physical Sciences', 65, TRUE),
('course_004', 'English Home Language', 60, TRUE),
('course_004', 'English First Additional Language', 60, FALSE),

-- Agricultural Sciences requirements
('course_005', 'Mathematics', 65, TRUE),
('course_005', 'Physical Sciences', 65, TRUE),
('course_005', 'Life Sciences', 65, TRUE),
('course_005', 'English Home Language', 60, TRUE),
('course_005', 'English First Additional Language', 60, FALSE);

-- Insert University Rankings (historical data)
INSERT INTO university_rankings (university_id, ranking_year, national_ranking, international_ranking, ranking_source) VALUES
('uct_001', 2024, 1, 156, 'QS World University Rankings'),
('wits_001', 2024, 2, 428, 'QS World University Rankings'),
('sun_001', 2024, 3, 395, 'QS World University Rankings'),
('up_001', 2024, 4, 561, 'QS World University Rankings'),
('ukzn_001', 2024, 5, 601, 'QS World University Rankings'),
('uct_001', 2023, 1, 160, 'QS World University Rankings'),
('wits_001', 2023, 2, 450, 'QS World University Rankings'),
('sun_001', 2023, 3, 400, 'QS World University Rankings');
