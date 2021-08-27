CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL
);