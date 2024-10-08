-- Custom SQL migration file, put you code below! --
INSERT INTO
	users (
		username,
		password, -- password = "admin1@AliceSmith"
		first_name,
		last_name,
		email,
		role_id,
		last_login,
		created_at
	)
VALUES
	(
		'admin',
		'$2b$10$3yeM6i6yRET1AQBvoqfHcOS2fJLuOS0RbEfhE7M0WZIrR6j9vXmZ6',
		'Alice',
		'Smith',
		'alice_smith@example.com',
		1,
		NULL,
		NOW()
	);
