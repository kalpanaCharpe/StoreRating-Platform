# StoreRating

Full-stack web app where users can browse and rate registered stores. Built entirely in JavaScript.

## Tech Stack

**Backend** — Node.js, Express.js, PostgreSQL, Prisma ORM, JWT, bcrypt, Zod  
**Frontend** — React 18, Vite, Tailwind CSS, Zustand, React Hook Form, Zod, Axios

---

## Project Structure

```
storerating-js/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/          # db.js, index.js
│       ├── controllers/     # auth, users, stores, ratings, dashboard
│       ├── middleware/      # auth.js, error.js, validate.js
│       ├── routes/          # one file per resource
│       ├── services/        # business logic layer
│       ├── validators/      # zod schemas
│       ├── utils/           # seed.js
│       └── index.js         # express app entry
└── frontend/
    └── src/
        ├── api/             # axios + per-resource api files
        ├── components/
        │   ├── layout/      # AppLayout, Sidebar, ProtectedRoute
        │   └── ui/          # Spinner, Alert, Modal, StarRating, etc.
        ├── pages/
        │   ├── admin/       # Dashboard, Users, UserDetail, Stores
        │   ├── auth/        # Login, Register, ChangePassword
        │   ├── owner/       # Dashboard
        │   └── user/        # Stores (with inline rating)
        ├── store/           # Zustand auth store
        └── utils/           # validation schemas, helpers
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Backend

```bash
cd backend

# 1. Copy env file and fill in your values
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Run database migrations
npx prisma migrate dev --name init

# 4. Generate Prisma client
npx prisma generate

# 5. Seed the default admin account
npm run db:seed

# 6. Start the dev server
npm run dev
```

Backend runs on `http://localhost:4000`

**Default admin login:**
- Email: `admin@storerating.dev`
- Password: `Admin@1234`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## User Roles & Access

| Role | What they can do |
|------|-----------------|
| `ADMIN` | Dashboard stats, manage users (create/view/filter), manage stores (create/edit/delete) |
| `USER` | Browse all stores, search, submit and update star ratings |
| `STORE_OWNER` | View their own store info, see all customer ratings, view average score |

All roles can change their password after logging in.

---

## API Reference

### Auth — `/api/auth`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/register` | Public | Register as a normal user |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | Any | Get current user info |
| PATCH | `/change-password` | Any | Update password |

### Users — `/api/users` (Admin only)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List users — supports `?name=&email=&address=&role=&sortBy=&order=` |
| GET | `/:id` | User detail (includes store + avg rating if STORE_OWNER) |
| POST | `/` | Create any role user |

### Stores — `/api/stores`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/` | Any auth | List stores — supports `?search=&sortBy=&order=` |
| GET | `/owner/dashboard` | STORE_OWNER | Dashboard with ratings + avg |
| GET | `/:id` | Any auth | Single store detail |
| POST | `/` | Admin | Create store |
| PATCH | `/:id` | Admin | Update store |
| DELETE | `/:id` | Admin | Delete store + all ratings |

### Ratings — `/api/ratings` (USER only)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/my-stores` | All stores with user's own rating attached |
| GET | `/:storeId/my-rating` | User's rating for a specific store |
| POST | `/:storeId` | Submit a new rating |
| PATCH | `/:storeId` | Update an existing rating |

### Dashboard — `/api/dashboard` (Admin only)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Returns `{ totalUsers, totalStores, totalRatings }` |

---

## Validation Rules

| Field | Rule |
|-------|------|
| Name | Min 20 chars, max 60 chars |
| Email | Standard email format |
| Password | 8–16 chars, at least one uppercase letter, at least one special character |
| Address | Max 400 chars |
| Rating | Integer between 1 and 5 |

Validation runs on both frontend (Zod + React Hook Form) and backend (Zod middleware).
