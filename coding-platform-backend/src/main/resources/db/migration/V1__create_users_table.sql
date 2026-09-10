CREATE TABLE users (id BIGSERIAL PRIMARY KEY,
 username VARCHAR(100) NOT NULL UNIQUE,
 email VARCHAR(255) NOT NULL UNIQUE, 
 password VARCHAR(255) NOT NULL, 
 role VARCHAR(20) NOT NULL DEFAULT 'USER',
  enabled BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMP NOT NULL DEFAULT now(), 
  updated_at TIMESTAMP);
INSERT INTO users (username,email,password,role) VALUES ('admin','admin@gmail.com','$2a$10$.w08NEarw2Yv4yfq6mH1q.jVE6.c31HJ4i5kvvBEFPRE1odSmV3M2','ADMIN');
