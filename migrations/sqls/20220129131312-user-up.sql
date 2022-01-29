CREATE TABLE store_users (
    id SERIAL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR NOT NULL,
    PRIMARY KEY (id)
);