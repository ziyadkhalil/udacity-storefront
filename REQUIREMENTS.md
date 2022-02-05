# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

---

## API Endpoints

#### Products

- Index `GET /api/product`
- Show (args: product id) `GET /api/product/:id`
- Create (args: Product)[token required] `POST /api/product/create`

#### Users

- Index [token required] `GET /api/user`
- Show (args: userName)[token required] `GET /api/user/:userName`
- Create (args: User)[token required] `POST /api/user/create`

#### Orders

- Current Order by user (args: user id)[token required] `GET /api/order/current`
- Completed Orders by user (args: user id)[token required] `GET /api/order/complete`

---

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- userName
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

---

## Database schema

### User table

| Field      | Type    |
| ---------- | ------- |
| id (PK)    | Integer |
| user_name  | Varchar |
| first_name | Varchar |
| last_name  | Varchar |
| password   | Varchar |

### Product table

| Field    | Type    |
| -------- | ------- |
| id (PK)  | Integer |
| name     | Varchar |
| price    | Integer |
| category | Varchar |

### Product table

| Field    | Type    |
| -------- | ------- |
| id (PK)  | Integer |
| name     | Varchar |
| price    | Integer |
| category | Varchar |

### User order table

| Field                | Type                  |
| -------------------- | --------------------- |
| id (PK)              | Integer               |
| user_id (FK to User) | Integer               |
| status               | `active` / `complete` |

### Order products table

| Field                           | Type    |
| ------------------------------- | ------- |
| order_id (PK) (FK to user)      | Integer |
| product_id (PK) (FK to product) | Integer |
| quantity                        | Integer |
