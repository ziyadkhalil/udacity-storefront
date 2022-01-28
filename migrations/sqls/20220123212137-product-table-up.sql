CREATE TABLE product (
    id SERIAL,
    name VARCHAR(100) NOT NULL,
    price int NOT NULL,
    category varchar(100),
    PRIMARY KEY (id)
);