import { sql } from "./index.js";

const initializeDatabase = async () => {
  try {
    console.log("Connecting to Neon PostgreSQL...");

    await sql`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role_id INTEGER NOT NULL REFERENCES roles(id),
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        verification_token TEXT,
        verification_token_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS verification_token TEXT;
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMPTZ;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        employee_code VARCHAR(50) UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        phone VARCHAR(30),
        department VARCHAR(100),
        designation VARCHAR(100),
        joining_date DATE,
        profile_picture TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      INSERT INTO roles (name)
      VALUES
        ('ADMIN'),
        ('HR'),
        ('EMPLOYEE')
      ON CONFLICT (name) DO NOTHING;
    `;

    await sql`
      DO $$
      BEGIN
        CREATE TYPE leave_type_enum AS ENUM ('paid', 'sick', 'unpaid');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END
      $$;
    `;

    await sql`
      DO $$
      BEGIN
        CREATE TYPE leave_status_enum AS ENUM ('pending', 'approved', 'rejected');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END
      $$;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL
          REFERENCES employees(id)
          ON DELETE RESTRICT,
        leave_type leave_type_enum NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        remarks TEXT,
        review_comment TEXT,
        status leave_status_enum NOT NULL DEFAULT 'pending',
        reviewed_by UUID
          REFERENCES users(id)
          ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT leave_dates_valid
          CHECK (end_date >= start_date),
        CONSTRAINT rejected_leave_requires_review_comment
          CHECK (
            status <> 'rejected'
            OR NULLIF(BTRIM(review_comment), '') IS NOT NULL
          ),
        CONSTRAINT reviewed_status_requires_reviewer
          CHECK (
            status = 'pending'
            OR reviewed_by IS NOT NULL
          )
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id
        ON leave_requests(employee_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_leave_requests_status
        ON leave_requests(status);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_leave_requests_reviewed_by
        ON leave_requests(reviewed_by);
    `;

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:");
    console.error(error);
    process.exitCode = 1;
  }
};

initializeDatabase();