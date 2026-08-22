# Dayflow

Dayflow is a role-based Human Resource Management System (HRMS) built for the Odoo x NMIT Bangalore Hackathon 2026. The verified implementation provides account signup and email verification, JWT-based login sessions, role-based access control, and a persisted leave request workflow backed by PostgreSQL on Neon.

## What's Working

- **Authentication:** `POST /api/auth/signup` creates a user and employee profile atomically, returns an email verification token for the current development flow, and `POST /api/auth/verify-email` verifies the account. `POST /api/auth/login` validates the password and returns a one-day JWT. `GET /api/auth/me` reads the authenticated user.
- **RBAC:** JWTs carry the user's role. Employees can create and view their own leave requests. HR and ADMIN users can view all leave requests and approve or reject pending requests.
- **Leave workflow:** Employees submit paid, sick, or unpaid leave with dates and optional remarks. HR/ADMIN reviewers can approve or reject requests; rejection requires a non-blank review comment. Requests and review changes persist in Neon PostgreSQL.

## Tech Stack

### Backend

- Node.js with Express
- Neon PostgreSQL via `@neondatabase/serverless`
- `bcryptjs` for password hashing
- `jsonwebtoken` for JWT authentication
- `cors` and `dotenv`

### Frontend

- React 19 with React DOM
- TypeScript
- Vite
- Oxlint

## Database

The database contains these tables:

- `roles`: unique `ADMIN`, `HR`, and `EMPLOYEE` roles.
- `users`: accounts, password hashes, roles, email verification state, and timestamps.
- `employees`: one employee profile per user, linked with a foreign key.
- `leave_requests`: employee leave applications and review state.

`leave_requests` uses enum types for leave type and status. It has foreign keys to `employees` and `users`, indexes for employee/status/reviewer lookups, a check that the end date is not before the start date, a required review comment for rejected requests, and a required reviewer for non-pending requests.

## Setup

### Backend

Requirements: Node.js and a PostgreSQL/Neon connection string.

Create `backend/.env` with these variables:

```text
PORT=5000
DATABASE_URL=<your PostgreSQL or Neon connection string>
JWT_SECRET=<your generated JWT secret>
CLIENT_URL=http://localhost:5173
```

Install dependencies, initialize the database, and start the API:

```powershell
cd backend
npm install
npm run db:init
npm start
```

The API runs on `http://localhost:5000`.

### Frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

To create a production build:

```powershell
cd frontend
npm run build
```

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `GET /api/auth/me` with a Bearer token
- `POST /api/leave` with a Bearer token
- `GET /api/leave` with a Bearer token
- `PATCH /api/leave/:id` with a Bearer token and HR/ADMIN role

## Scope

Attendance, Payroll, Analytics, employee management CRUD, password reset, and production email delivery were planned but are not completed in this round.
