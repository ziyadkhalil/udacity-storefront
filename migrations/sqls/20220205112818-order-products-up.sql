CREATE TABLE order_products (
    order_id int NOT NULL,
    product_id int NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY (order_id, product_id),
    CONSTRAINT fk_order
        FOREIGN KEY(order_id)
            REFERENCES user_order(id)
                ON DELETE CASCADE,
    CONSTRAINT fk_product
        FOREIGN KEY(product_id)
            REFERENCES product(id)
                ON DELETE CASCADE
);