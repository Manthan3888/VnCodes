# Backend API (Node.js + Express + MongoDB)

Production-ready REST API with JWT auth, Mongoose, and clean structure.  
This folder is the **Server** (backend) of the project.

## Setup

1. From project root or this folder, copy env example and set values:
   ```bash
   cd Server
   cp .env.example .env
   ```
2. Set `MONGO_URI` (e.g. `mongodb://localhost:27017/my-website`), `JWT_SECRET`, `JWT_ADMIN_SECRET`, `FRONTEND_URL` (e.g. `http://localhost:3000`).
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   Server runs on `PORT` (default 5000).

## Environment (.env)

- `PORT` – Server port (default 5000)
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for user tokens
- `JWT_EXPIRES_IN` – User token expiry (e.g. 7d)
- `JWT_ADMIN_SECRET` – Secret for admin tokens
- `JWT_ADMIN_EXPIRES_IN` – Admin token expiry (e.g. 1d)
- `FRONTEND_URL` – Allowed CORS origin
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – Default admin (created if no admins exist)

## API Overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (Bearer user token); `POST /api/auth/admin/login`, `GET /api/auth/admin/me` (Bearer admin token).
- **Templates:** `GET /api/templates`, `GET /api/templates/:id` (public); `POST/PUT/DELETE /api/templates` (admin).
- **Categories:** `GET /api/categories`; `POST/PUT/DELETE /api/categories/:id` (admin).
- **Orders:** `POST /api/orders` (create; optional user Bearer), `GET /api/orders/me` (user), `GET /api/orders/admin` (admin), `PATCH /api/orders/:id/status` (admin).
- **Users:** `GET /api/users`, `DELETE /api/users/:id` (admin).
- **Stats:** `GET /api/admin/stats` (admin; totalTemplates, totalOrders, totalRevenue, totalUsers, recentOrders).

All admin routes require `Authorization: Bearer <admin_token>`.
