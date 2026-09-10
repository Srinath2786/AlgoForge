CREATE TABLE user_roles (user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE, 
PRIMARY KEY(user_id,role_id));
INSERT INTO user_roles(user_id,role_id) SELECT u.id,r.id FROM users u JOIN roles r ON r.name=u.role;
