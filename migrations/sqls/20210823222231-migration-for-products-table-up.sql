CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(70) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(70)
);