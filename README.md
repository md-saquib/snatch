# Snatch — Full-Stack E-Commerce Platform

A full-stack e-commerce application built with a **Node.js/Express** backend and a **React.js** frontend, living in a monorepo structure.

---

## 📁 Monorepo Structure

```
snatch/
├── server/               ← Node.js + Express + MongoDB backend
│   ├── src/
│   │   ├── app/          ← Express app setup (middleware, routes)
│   │   ├── config/       ← DB connection, env config
│   │   ├── controller/   ← Route handler functions
│   │   ├── middleware/   ← JWT auth guard (verifyUser)
│   │   ├── model/        ← Mongoose schemas (User, Product)
│   │   ├── multer/       ← Multer config for image upload
│   │   ├── Routes/       ← Express route definitions
│   │   ├── services/     ← ImageKit upload service
│   │   ├── utils/        ← JWT token generator/verifier
│   │   └── validator/    ← express-validator rules
│   └── package.json
│
├── client/               ← React.js + Vite frontend
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/     ← Auth context, API, hooks, pages
│   │   │   └── products/ ← Product API, hooks, pages
│   │   ├── components/   ← Shared UI (Navbar, Button, FormInput, Modal)
│   │   ├── layouts/      ← MainLayout, AuthLayout
│   │   ├── lib/          ← Axios instance + interceptors
│   │   ├── routes/       ← AppRouter, ProtectedRoute
│   │   └── App.jsx
│   └── package.json
│
└── README.md             ← This file
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **npm** v9+
- A running **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- An **ImageKit** account for image storage ([imagekit.io](https://imagekit.io))

---

## 🚀 Setup & Installation

### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd snatch
```

### Step 2 — Configure Backend Environment Variables

Create a `.env` file inside the `server/` directory:

```bash
# server/.env

PORT=5000
MONGO_URI=mongodb://localhost:27017/snatch   # or your Atlas URI
ACCESS_TOKEN_SECRET=your_super_secret_access_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# ImageKit credentials (from your ImageKit dashboard)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### Step 3 — Install & Run the Backend

```bash
cd server
npm install
npm run dev
# Server will start on http://localhost:5000
```

### Step 4 — Install & Run the Frontend

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
# Frontend will start on http://localhost:5173
```

### Step 5 — Open the App

Navigate to **http://localhost:5173** in your browser.

> The Vite dev server proxies all `/api` requests to `http://localhost:5000`, so both servers must be running simultaneously.

---

## 🔐 How Authentication Works

```
┌─────────────┐    POST /api/auth/login    ┌─────────────┐
│   Browser   │ ─────────────────────────► │   Express   │
│             │ ◄───────────────────────── │             │
│             │  { accessToken } + Set-    │             │
│             │  Cookie: refreshToken      │             │
│             │  (httpOnly, server-side)   │             │
│             │                            │             │
│ localStorage│    Bearer <accessToken>    │             │
│ accessToken │ ─────────────────────────► │ Protected   │
│             │   on every API request     │   Routes    │
└─────────────┘                            └─────────────┘

When accessToken expires (401):
  Axios interceptor → GET /api/auth/refreshToken
  → Server reads httpOnly cookie → issues new accessToken
  → Retry original request transparently
```

---

## 📡 API Endpoints Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:-------------:|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive accessToken |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `GET` | `/api/auth/refreshToken` | 🍪 Cookie | Silently refresh access token |
| `GET` | `/api/auth/logout` | ✅ | Logout and clear refresh cookie |

#### Register Request Body
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login Request Body
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login Success Response
```json
{
  "success": true,
  "message": "login successfull",
  "data": {
    "user": { "_id": "...", "fullName": "John Doe", "email": "..." },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Validation Error Response (400)
```json
{
  "errors": [
    { "path": "email", "msg": "Please provide a valid email" },
    { "path": "password", "msg": "Password must be at least 6 characters long" }
  ]
}
```

---

### Product Routes — `/api/product`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:-------------:|-------------|
| `GET` | `/api/product/allproducts` | ❌ | List all products |
| `GET` | `/api/product/:id` | ❌ | Get a single product |
| `POST` | `/api/product/createproduct` | ✅ | Create product (multipart/form-data) |
| `PATCH` | `/api/product/updateproduct/:id` | ✅ | Update product (multipart/form-data) |
| `DELETE` | `/api/product/:id` | ✅ | Delete a product |

#### Product Create/Update Request (multipart/form-data)

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `title` | `string` | ✅ | 2–100 characters |
| `description` | `string` | ✅ | 10–500 characters |
| `price[currency]` | `string` | ✅ | `"USD"` or `"INR"` |
| `price[amount]` | `number` | ✅ | Min 1 |
| `sizes[0][size]` | `string` | ✅ | One of: `S M L XL XXL XXXL` |
| `sizes[0][stock]` | `number` | ✅ | Min 1 |
| `images` | `file[]` | ✅ | Up to 5 images |

#### Product Success Response
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "64abc123...",
    "title": "Classic Cotton T-Shirt",
    "description": "A comfortable everyday t-shirt...",
    "price": { "currency": "INR", "amount": 999 },
    "sizes": [
      { "size": "M", "stock": 50 },
      { "size": "L", "stock": 30 }
    ],
    "images": ["https://ik.imagekit.io/..."],
    "userId": "64xyz...",
    "isPublic": false
  }
}
```

---

## 🧩 Frontend Architecture

The frontend follows a strict **Feature-based Architecture**:

- **`src/lib/axiosInstance.js`** — Single Axios instance with request interceptor (attaches `Bearer <token>`) and response interceptor (auto-refresh on 401).
- **`src/features/auth/`** — Everything auth: `AuthContext` (global state), `authApi.js` (API calls), `useAuth.js` (business logic hooks), `components/` (UI pages).
- **`src/features/products/`** — Everything products: `productApi.js`, `useProducts.js` (hooks), `components/` (pages).
- **`src/components/`** — Shared, reusable UI components (`Button`, `FormInput`, `ConfirmModal`, `Navbar`).
- **`src/routes/`** — `AppRouter.jsx` (all route definitions) + `ProtectedRoute.jsx` (auth guard).

### Data Flow Pattern

```
UI Component (renders only)
     ↓ calls
Custom Hook (business logic, state)
     ↓ calls
API Service file (axios calls)
     ↓ via
Axios Instance (interceptors attach token, handle 401)
     ↓
Express Backend
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios (with interceptors) |
| Notifications | react-hot-toast |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + httpOnly refresh tokens) |
| Validation | express-validator |
| Image Storage | ImageKit |
| File Upload | Multer |

---

## 📜 License

MIT
