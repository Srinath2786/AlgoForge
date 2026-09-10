UPDATE users
SET email = 'admin@gmail.com',
    password = '$2a$10$Q9tZl6m0Rr5B1m7B4a1cY.0kN3LhsvVJQ1pW9EjvYjTx4hL0sB6fO',
    role = 'ADMIN',
    enabled = TRUE
WHERE username = 'admin';
