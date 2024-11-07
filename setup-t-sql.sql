/*
Description: T-SQL SCRIPT TO BUILD BASIC USER AUTH SESSION TABLES
Author: d@wonder.tax
Date: 20241106
*/

USE msbuxley;
GO

-- create our user table

CREATE TABLE [dbo].[user]
(
	id UNIQUEIDENTIFIER DEFAULT NEWSEQUENTIALID(),
	CONSTRAINT PK_user PRIMARY KEY NONCLUSTERED (id),
	github_id INT NOT NULL,
	CONSTRAINT AK_github_id UNIQUE(github_id),
	email NVARCHAR(320) NOT NULL,
	CONSTRAINT AK_email UNIQUE(email),
	username NVARCHAR(256),
);

CREATE CLUSTERED INDEX github_id_index ON [dbo].[user](github_id)

-- create our session(s) table

CREATE TABLE [dbo].[session] (
	id nvarchar(64) NOT NULL,
	CONSTRAINT PK_session PRIMARY KEY CLUSTERED (id),
	user_id UNIQUEIDENTIFIER NOT NULL,
	CONSTRAINT FK_session FOREIGN KEY (user_id)
		REFERENCES [dbo].[user](id),
	expires_at INTEGER NOT NULL
);

/**

-- Inspect:

SELECT * from [dbo].[user]

SELECT * FROM [dbo].[session]

**/

/**

-- Tear down and restart:

DROP INDEX IF EXISTS github_id_index ON [dbo].[user];

--drop session first to remove foreign key contraint on user table

DROP TABLE IF EXISTS [dbo].[session];

DROP TABLE IF EXISTS [dbo].[user];


**/

