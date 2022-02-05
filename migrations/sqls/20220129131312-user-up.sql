CREATE TABLE store_users (
    id SERIAL,
    user_name VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR NOT NULL,
    PRIMARY KEY (id)
);