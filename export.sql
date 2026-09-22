--
-- tspace-mysql SQL Dump
-- https://www.npmjs.com/package/tspace-mysql
--
-- Driver: 'postgres'
-- Generation Time: Tue Sep 22 2026 21:58:51 GMT+0700 (Indochina Time) 
--
-- Database: 'dump_1790089130874'
-- 

-- --------------------------------------------------------

--
-- Table structure for table 'products'
--

CREATE TABLE IF NOT EXISTS "products" (
    "id" integer NOT NULL PRIMARY KEY,
    "name" character varying(100) NOT NULL,
    "stock" integer NOT NULL
);

--
-- Dumping data for table 'products'
--

INSERT INTO "products" ("id","name","stock") VALUES (4,'Rollback Test Product',100) RETURNING *;

--
-- Table structure for table 'orders'
--

CREATE TABLE IF NOT EXISTS "orders" (
    "id" integer NOT NULL PRIMARY KEY,
    "user_id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "qty" integer NOT NULL,
    "created_at" timestamp without time zone NULL
);

--
-- Table structure for table 'post_user'
--

CREATE TABLE IF NOT EXISTS "post_user" (
    "id" integer NOT NULL PRIMARY KEY ,
    "uuid" character varying(50) NULL,
    "user_id" integer NOT NULL,
    "post_id" integer NOT NULL,
    "created_at" timestamp without time zone NULL,
    "updated_at" timestamp without time zone NULL,
    "deleted_at" timestamp without time zone NULL
);

--
-- Dumping data for table 'post_user'
--

INSERT INTO "post_user" ("id","uuid","user_id","post_id","created_at","updated_at","deleted_at") VALUES (1,'30961a1d-cb2d-4541-9d00-3850b7f3c2a5',1,1,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (2,'b9b7ef21-019a-4b68-9fd1-6bfd6476d1e3',2,2,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (3,'71e992f1-2f0f-4106-97ca-03410de334c4',3,3,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (4,'f2a7c63c-4abd-4ed4-ba51-ed7521bde2e9',4,4,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (5,'fa32873a-71de-45ea-85c4-4137a1886b06',5,5,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (6,'3f145b25-e93a-4b89-8fbc-007bd9779b5c',7,7,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (7,'cbd4b856-934d-4aaa-a28d-87fe90c3cf1c',7,8,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (8,'9ade8062-36e2-45fa-b134-c2e411797aa7',7,9,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (9,'f0ca816b-9e2c-4820-af09-3e6db543c53b',7,10,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (10,'e257e2c8-d4fb-4964-be7b-658beb413f83',7,11,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (11,'2691f434-ff50-41bf-83c6-c69a62bdf148',8,12,'2026-09-02 20:02:04','2026-09-02 20:02:04',NULL), (12,'937e8cda-d334-46eb-a170-3f7c14542e90',8,13,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (13,'c3924fee-0dc9-4823-9dce-958e5faecd94',8,14,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (14,'27d19537-6b27-4db7-bb94-408bb78846cf',8,15,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (15,'37f91d08-bbdc-4105-bcae-f693e184648d',8,16,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (16,'8bac127a-10bb-4304-9bd8-2d8e4469e91e',9,17,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (17,'2ac2bec8-6076-43e7-948d-420c3ae7da19',9,18,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (18,'ba113ea5-f66c-429a-9558-919bfe04006b',9,19,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (19,'3600adf9-d6ad-47ec-b5cb-0c6e04c51551',9,20,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (20,'1d0ec753-a762-47e9-9f40-7d384a2e068f',9,21,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (21,'c35fbc61-0e15-4e3d-8eeb-28dbb9576ad8',10,22,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (22,'e7aef97f-44f5-4043-8d09-8c3051af15be',10,23,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (23,'24ea9a08-34c7-4fc5-aecf-2f78bb96c607',10,24,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (24,'4a1b10c4-2d26-452f-a8d2-e6ef5e629e35',10,25,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (25,'604aee1c-b925-4fc8-88bc-4add2673bf4b',10,26,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (26,'03d856c7-9560-49ab-a75c-91c0a46b9e50',11,27,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (27,'6b7434ea-eb2f-40f1-b413-1791fb81348e',11,28,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (28,'ea600b07-ae32-4d7c-a7b4-ca62cc0dd0b4',11,29,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (29,'b4bdeb62-97cf-4c83-a739-67018543fcb7',11,30,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL), (30,'04ecc913-a7c4-467c-8744-d7719e826ddc',11,31,'2026-09-02 20:02:05','2026-09-02 20:02:05',NULL) RETURNING *;

--
-- Table structure for table 'users'
--

CREATE TABLE IF NOT EXISTS "users" (
    "id" integer NOT NULL PRIMARY KEY ,
    "uuid" character varying(50) NULL,
    "email" character varying(50) NULL,
    "name" character varying(255) NULL,
    "username" character varying(255) NULL,
    "password" character varying(255) NULL,
    "status" boolean NULL DEFAULT 'false',
    "role" character varying(255) NULL,
    "created_at" timestamp without time zone NULL,
    "updated_at" timestamp without time zone NULL,
    "deleted_at" timestamp without time zone NULL
);

--
-- Dumping data for table 'users'
--

INSERT INTO "users" ("id","uuid","email","name","username","password","status","role","created_at","updated_at","deleted_at") VALUES (6,'372623cd-f013-46e9-945b-b6a6048d371e','test06@example.com','was update','test06','xxxxxxxxxx','1',NULL,'2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (1,'bc179cef-cd06-44cd-82d4-1f01aa6d7859','test01@example.com','name:test01','test01','xxxxxxxxxx','1',NULL,'2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (2,'36ce7b95-6eb6-4337-849f-d24d582c6722','test02@example.com','name:test02','test02','xxxxxxxxxx','1',NULL,'2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (3,'af42e2b7-8b56-401f-a239-9c3db99a507b','test03@example.com','name:test03','test03','xxxxxxxxxx','0',NULL,'2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (4,'84fcc4b4-728f-4327-98ff-7e65c86b80ae','test04@example.com','name:test04','test04','xxxxxxxxxx','1',NULL,'2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (5,'86f8a647-c7ed-412c-baca-0ad97a8fbe6d','test05@example.com','name:test05','test05','xxxxxxxxxx','1',NULL,'2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (7,'36ce7b95-6eb6-4337-849f-d24d582c6722','test02@example.com','name:test02','test02','xxxxxxxxxx','1',NULL,'2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (8,'af42e2b7-8b56-401f-a239-9c3db99a507b','test03@example.com','name:test03','test03','xxxxxxxxxx','0',NULL,'2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (9,'84fcc4b4-728f-4327-98ff-7e65c86b80ae','test04@example.com','name:test04','test04','xxxxxxxxxx','1',NULL,'2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (10,'86f8a647-c7ed-412c-baca-0ad97a8fbe6d','test05@example.com','name:test05','test05','xxxxxxxxxx','1',NULL,'2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (11,'372623cd-f013-46e9-945b-b6a6048d371e','test06@example.com','name:test06','test06','xxxxxxxxxx','1',NULL,'2026-09-02 20:01:46','2026-09-02 20:01:46',NULL) RETURNING *;

--
-- Table structure for table 'posts'
--

CREATE TABLE IF NOT EXISTS "posts" (
    "id" integer NOT NULL PRIMARY KEY,
    "uuid" character varying(50) NULL,
    "user_id" integer NULL,
    "title" character varying(100) NOT NULL,
    "subtitle" character varying(100) NULL,
    "description" character varying(255) NULL,
    "created_at" timestamp without time zone NULL,
    "updated_at" timestamp without time zone NULL,
    "deleted_at" timestamp without time zone NULL
);

--
-- Dumping data for table 'posts'
--

INSERT INTO "posts" ("id","uuid","user_id","title","subtitle","description","created_at","updated_at","deleted_at") VALUES (6,'dcdde1a6-72bb-4826-b950-5cc842606dc1',6,'was update','subtitle:test06','test06','2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (1,'12b3f7e6-a4b2-4ef8-9360-a39625c83da7',1,'title:01','subtitle:test01','test01','2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (2,'c1097d72-27c2-4177-a5c0-4515867d910c',2,'title:02','subtitle:test02','test02','2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (3,'ee650eb4-960f-4c2f-8aa8-605fd9ae623b',3,'title:03','subtitle:test03','test03','2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (4,'4241971c-7fcc-4250-964b-2af2427887c8',NULL,'title:04','subtitle:test04','test04','2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (5,'8cd48772-39d8-42d6-86dd-9ad5f368d81a',5,'title:05','subtitle:test05','test05','2026-09-02 20:01:46','2026-09-02 20:02:04','2026-09-02 20:02:04'), (7,'c1097d72-27c2-4177-a5c0-4515867d910c',7,'title:02','subtitle:test02','test02','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (8,'ee650eb4-960f-4c2f-8aa8-605fd9ae623b',7,'title:03','subtitle:test03','test03','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (9,'4241971c-7fcc-4250-964b-2af2427887c8',7,'title:04','subtitle:test04','test04','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (10,'8cd48772-39d8-42d6-86dd-9ad5f368d81a',7,'title:05','subtitle:test05','test05','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (11,'dcdde1a6-72bb-4826-b950-5cc842606dc1',7,'title:06','subtitle:test06','test06','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (12,'c1097d72-27c2-4177-a5c0-4515867d910c',8,'title:02','subtitle:test02','test02','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (13,'ee650eb4-960f-4c2f-8aa8-605fd9ae623b',8,'title:03','subtitle:test03','test03','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (14,'4241971c-7fcc-4250-964b-2af2427887c8',8,'title:04','subtitle:test04','test04','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (15,'8cd48772-39d8-42d6-86dd-9ad5f368d81a',8,'title:05','subtitle:test05','test05','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (16,'dcdde1a6-72bb-4826-b950-5cc842606dc1',8,'title:06','subtitle:test06','test06','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (17,'c1097d72-27c2-4177-a5c0-4515867d910c',9,'title:02','subtitle:test02','test02','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (18,'ee650eb4-960f-4c2f-8aa8-605fd9ae623b',9,'title:03','subtitle:test03','test03','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (19,'4241971c-7fcc-4250-964b-2af2427887c8',9,'title:04','subtitle:test04','test04','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (20,'8cd48772-39d8-42d6-86dd-9ad5f368d81a',9,'title:05','subtitle:test05','test05','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (21,'dcdde1a6-72bb-4826-b950-5cc842606dc1',9,'title:06','subtitle:test06','test06','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (22,'c1097d72-27c2-4177-a5c0-4515867d910c',10,'title:02','subtitle:test02','test02','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (23,'ee650eb4-960f-4c2f-8aa8-605fd9ae623b',10,'title:03','subtitle:test03','test03','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (24,'4241971c-7fcc-4250-964b-2af2427887c8',10,'title:04','subtitle:test04','test04','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (25,'8cd48772-39d8-42d6-86dd-9ad5f368d81a',10,'title:05','subtitle:test05','test05','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (26,'dcdde1a6-72bb-4826-b950-5cc842606dc1',10,'title:06','subtitle:test06','test06','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (27,'c1097d72-27c2-4177-a5c0-4515867d910c',11,'title:02','subtitle:test02','test02','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (28,'ee650eb4-960f-4c2f-8aa8-605fd9ae623b',11,'title:03','subtitle:test03','test03','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (29,'4241971c-7fcc-4250-964b-2af2427887c8',11,'title:04','subtitle:test04','test04','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (30,'8cd48772-39d8-42d6-86dd-9ad5f368d81a',11,'title:05','subtitle:test05','test05','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL), (31,'dcdde1a6-72bb-4826-b950-5cc842606dc1',11,'title:06','subtitle:test06','test06','2026-09-02 20:01:46','2026-09-02 20:01:46',NULL) RETURNING *;