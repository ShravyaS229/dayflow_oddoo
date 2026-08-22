import { query, pool } from "./index.js";
import { rolesTable } from "./schema/roles.js";
import { usersTable } from "./schema/users.js";
import { employeesTable } from "./schema/employees.js";

const initializeDatabase = async () => {
  try {
    console.log("Connecting to Neon PostgreSQL...");

    await query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `);

    await query(rolesTable);
    await query(usersTable);
    await query(employeesTable);

    await query(`
      INSERT INTO roles (name)
      VALUES
        ('ADMIN'),
        ('HR'),
        ('EMPLOYEE')
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:");
    console.error(error);
  } finally {
    await pool.end();
  }
};

initializeDatabase();