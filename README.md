# To run

1.  Add these environment variables to `.env` file in root
    | name | value |
    | ------------- | -------- |
    | POSTGRES_HOST | postgres |
    | POSTGRES_DB | storedb |
    | POSTGRES_USER | frontstore_admin |
    | POSTGRES_PASSWORD | password123 |
    | TOKEN_SECRET | my_jwt_secret |
    | BCRYPT_PASSWORD | awesome_frontstore_password |
    | SALT_ROUNDS | 10 |

2.  Run

    `docker compose -f ./docker-compose.yaml --env-file .env up --build`

## Ports

| service  | port |
| -------- | ---- |
| express  | 4000 |
| postgres | 5432 |

---

# To Test

1.  Add these environment variables to `.test.env` file in root
    | name | value |
    | ------------- | -------- |
    | POSTGRES_HOST | postgres_test |
    | POSTGRES_DB | storedb_test |
    | POSTGRES_USER | frontstore_admin_test |
    | POSTGRES_PASSWORD | password123_test |
    | TOKEN_SECRET | my_jwt_secret_test |
    | BCRYPT_PASSWORD | awesome_frontstore_password_test |
    | SALT_ROUNDS | 10 |

2.  Run

    `docker compose -f ./docker-compose.test.yaml --env-file .test.env up --exit-code-from sut --build`
