# StoreRating-Platform

Full-stack web app where users can browse and rate registered stores.

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
        │   └── user/        # Stores 
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



