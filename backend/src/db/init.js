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

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:");
    console.error(error);
    process.exitCode = 1;
  }
};

initializeDatabase();