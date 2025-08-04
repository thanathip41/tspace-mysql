SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `subtitle` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `post_user` (
  `id` int NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `user_post_counts` (
`id` bigint unsigned
,`user_id` int
,`name` varchar(255)
,`email` varchar(50)
,`post_count` bigint
);

ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `post_user`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `post_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER 
VIEW `user_post_counts` AS
SELECT 
  row_number() OVER (ORDER BY `users`.`id`) AS `id`, 
  `users`.`id` AS `user_id`, 
  `users`.`name` AS `name`, 
  `users`.`email` AS `email`, 
  COUNT(`posts`.`id`) AS `post_count` 
FROM `users`
LEFT JOIN `posts` 
  ON `users`.`id` = `posts`.`user_id`
GROUP BY 
  `users`.`id`, 
  `users`.`name`;


-- Insert data into users
INSERT INTO  `users` (id, uuid, email, name, username, password, status, role, created_at, updated_at, deleted_at) VALUES
(1, '3e145569-afb3-4932-9a56-8c3ac1a74a46', 'test01@example.com', 'name:test01', 'test01', 'xxxxxxxxxx', TRUE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(2, '1c50de95-69a5-4da6-b635-f5267c8091fc', 'test02@example.com', 'name:test02', 'test02', 'xxxxxxxxxx', TRUE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(3, '08819d04-03fc-4862-b065-94d98b6d31d3', 'test03@example.com', 'name:test03', 'test03', 'xxxxxxxxxx', TRUE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(4, '2c6ed7a5-a731-47d5-b2a6-e82d9bd4c7d3', 'test04@example.com', 'name:test04', 'test04', 'xxxxxxxxxx', FALSE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(5, '8b3e3259-25e5-4729-a8e6-011db0f72d79', 'test05@example.com', 'name:test05', 'test05', 'xxxxxxxxxx', FALSE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(6, '3712543d-05e9-49f1-864f-46093dc30842', 'test06@example.com', 'was update', 'test06', 'xxxxxxxxxx', TRUE, 'user', '2025-08-03 00:56:34', '2025-08-03 00:56:36', '2025-08-03 00:56:36');

-- Insert data into posts
INSERT INTO  `posts` (id, uuid, title, subtitle, description, user_id, created_at, updated_at, deleted_at) VALUES
(1, '8db49a18-8ec6-4140-8b1a-c5ff94704da2', 'title:01', 'subtitle:test01', 'test01', 1, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(2, '4d8829fe-bfaf-4c1d-a3af-998d0947424e', 'title:02', 'subtitle:test02', 'test02', 2, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(3, '007def8f-2444-4986-85fa-cddfd19502df', 'title:03', 'subtitle:test03', 'test03', 3, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(4, '96a1b351-09cd-442a-85c8-58caea44d809', 'title:04', 'subtitle:test04', 'test04', NULL, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(5, '4118abf0-e175-40d2-b0b6-55773362531d', 'title:05', 'subtitle:test05', 'test05', 5, '2025-08-03 00:56:34', '2025-08-03 00:56:34', NULL),
(6, 'cb919c5f-0e1d-49a1-a01b-d348f437ef7f', 'was update', 'subtitle:test06', 'test06', 6, '2025-08-03 00:56:34', '2025-08-03 00:56:36', '2025-08-03 00:56:36');

-- Insert data into post_user
INSERT INTO  `post_user` (id, uuid, user_id, post_id, created_at, updated_at, deleted_at) VALUES
(1, 'adb01cf4-6ff5-4f9a-b29b-aff008ee6e5d', 1, 1, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL),
(2, '7f7452b3-b36f-4f63-b2e5-b01c66692762', 2, 2, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL),
(3, '0fd0c69a-e6fa-45ce-89b6-d60253e21e7e', 3, 3, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL),
(4, '0644fe0c-e93b-4e1e-9023-df14abff079b', 4, 4, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL),
(5, 'fecb47a2-1515-44c5-b448-1dc29f248374', 5, 5, '2025-08-03 00:56:36', '2025-08-03 00:56:36', NULL);

COMMIT;

