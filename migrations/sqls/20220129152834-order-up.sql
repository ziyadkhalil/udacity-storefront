CREATE TYPE order_status AS ENUM('active', 'complete');

CREATE TABLE user_order (
    id SERIAL,
    user_id int NOT NULL,
    status order_status,
    PRIMARY KEY (id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES store_users(id)
                ON DELETE CASCADE
);
