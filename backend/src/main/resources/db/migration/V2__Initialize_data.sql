-- Insert Superadmin User
-- Password "superadmin" hashed with BCrypt
INSERT INTO users (id, name, email, password, is_superuser, is_staff)
VALUES (UUID(), 'superadmin', 'superadmin@email.com', '$2a$10$8.UnVuG9HHgffUDAlk8qn.6nQHsuG8H.30uH6.LOK0m.q2Xm8qT.', 1, 1);

-- Insert Topics
INSERT INTO topics (topic_name, description)
VALUES 
('Technology Basics', 'Essential guides to help you navigate digital tools and devices with confidence.'),
('Scam Awareness', 'Learn how to identify common online threats and protect your personal information.');
