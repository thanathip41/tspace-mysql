DROP VIEW IF EXISTS user_post_counts;
DROP TABLE IF EXISTS post_user CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role;


CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(50),
  email VARCHAR(50),
  name VARCHAR(255),
  username VARCHAR(255),
  password VARCHAR(255),
  status BOOLEAN DEFAULT FALSE,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(50),
  title VARCHAR(100) NOT NULL,
  subtitle VARCHAR(100),
  description VARCHAR(255),
  user_id INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE post_user (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(50),
  user_id INT,
  post_id INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE OR REPLACE VIEW user_post_counts AS
SELECT
  ROW_NUMBER() OVER (ORDER BY u.id) AS id,
  u.id AS user_id,
  u.name,
  u.email,
  COUNT(p.id) AS post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name, u.email;


INSERT INTO users (id, uuid, email, name, username, password, status, role, created_at, updated_at, deleted_at) VALUES
(1, '3e145569-afb3-4932-9a56-8c3ac1a74a46', 'test01@example.com', 'name:test01', 'test01', 'xxxxxxxxxx', TRUE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(2, '1c50de95-69a5-4da6-b635-f5267c8091fc', 'test02@example.com', 'name:test02', 'test02', 'xxxxxxxxxx', TRUE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(3, '08819d04-03fc-4862-b065-94d98b6d31d3', 'test03@example.com', 'name:test03', 'test03', 'xxxxxxxxxx', TRUE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(4, '2c6ed7a5-a731-47d5-b2a6-e82d9bd4c7d3', 'test04@example.com', 'name:test04', 'test04', 'xxxxxxxxxx', FALSE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(5, '8b3e3259-25e5-4729-a8e6-011db0f72d79', 'test05@example.com', 'name:test05', 'test05', 'xxxxxxxxxx', FALSE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(6, '3712543d-05e9-49f1-864f-46093dc30842', 'test06@example.com', 'was update', 'test06', 'xxxxxxxxxx', TRUE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:36', '2025-08-03 00:56:36');

-- Insert data into posts
INSERT INTO posts (id, uuid, title, subtitle, description, user_id, created_at, updated_at, deleted_at) VALUES
(1, '8db49a18-8ec6-4140-8b1a-c5ff94704da2', 'title:01', 'subtitle:test01', 'test01', 1, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(2, '4d8829fe-bfaf-4c1d-a3af-998d0947424e', 'title:02', 'subtitle:test02', 'test02', 2, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(3, '007def8f-2444-4986-85fa-cddfd19502df', 'title:03', 'subtitle:test03', 'test03', 3, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(4, '96a1b351-09cd-442a-85c8-58caea44d809', 'title:04', 'subtitle:test04', 'test04', NULL, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(5, '4118abf0-e175-40d2-b0b6-55773362531d', 'title:05', 'subtitle:test05', 'test05', 5, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(6, 'cb919c5f-0e1d-49f1-a01b-d348f437ef7f', 'was update', 'subtitle:test06', 'test06', 6, '2025-08-03 00:56:34', '2025-08-03 00:56:36', '2025-08-03 00:56:36');

-- Insert data into post_user
INSERT INTO post_user (id, uuid, user_id, post_id, created_at, updated_at, deleted_at) VALUES
(1, 'adb01cf4-6ff5-4f9a-b29b-aff008ee6e5d', 1, 1, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL),
(2, '7f7452b3-b36f-4f63-b2e5-b01c66692762', 2, 2, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL),
(3, '0fd0c69a-e6fa-45ce-89b6-d60253e21e7e', 3, 3, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL),
(4, '0644fe0c-e93b-4e1e-9023-df14abff079b', 4, 4, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL),
(5, 'fecb47a2-1515-44c5-b448-1dc29f248374', 5, 5, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL);
