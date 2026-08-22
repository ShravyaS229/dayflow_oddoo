import { sql } from "../../db/index.js";

export const findUserByEmail = async (email) => {
  const rows = await sql`
    SELECT
      u.id,
      u.email,
      u.password_hash,
      u.email_verified,
      u.verification_token,
      u.verification_token_expires_at,
      r.name AS role
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE LOWER(u.email) = LOWER(${email})
    LIMIT 1;
  `;

  return rows[0] || null;
};

export const findUserById = async (id) => {
  const rows = await sql`
    SELECT
      u.id,
      u.email,
      u.email_verified,
      r.name AS role,
      e.id AS employee_id,
      e.employee_code,
      e.first_name,
      e.last_name
    FROM users u
    JOIN roles r ON r.id = u.role_id
    LEFT JOIN employees e ON e.user_id = u.id
    WHERE u.id = ${id}
    LIMIT 1;
  `;

  return rows[0] || null;
};

export const createUser = async ({
  email,
  passwordHash,
  roleId,
  verificationToken,
  verificationTokenExpiresAt,
}) => {
  const rows = await sql`
    INSERT INTO users (
      email,
      password_hash,
      role_id,
      verification_token,
      verification_token_expires_at
    )
    VALUES (
      ${email},
      ${passwordHash},
      ${roleId},
      ${verificationToken},
      ${verificationTokenExpiresAt}
    )
    RETURNING id, email, email_verified;
  `;

  return rows[0];
};

export const getRoleId = async (roleName) => {
  const rows = await sql`
    SELECT id, name
    FROM roles
    WHERE name = ${roleName}
    LIMIT 1;
  `;

  return rows[0] || null;
};

export const verifyUserEmail = async (token) => {
  const rows = await sql`
    UPDATE users
    SET
      email_verified = TRUE,
      verification_token = NULL,
      verification_token_expires_at = NULL,
      updated_at = NOW()
    WHERE verification_token = ${token}
      AND verification_token_expires_at > NOW()
    RETURNING id, email;
  `;

  return rows[0] || null;
};