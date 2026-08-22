import { sql } from "../db/index.js";

export const findEmployeeByUserId = async (userId) => {
  const rows = await sql`
    SELECT id, user_id, first_name, last_name
    FROM employees
    WHERE user_id = ${userId}
    LIMIT 1;
  `;

  return rows[0] || null;
};

export const createLeaveRequest = async ({
  employeeId,
  leaveType,
  startDate,
  endDate,
  remarks,
}) => {
  const rows = await sql`
    INSERT INTO leave_requests (
      employee_id,
      leave_type,
      start_date,
      end_date,
      remarks
    )
    VALUES (
      ${employeeId},
      ${leaveType},
      ${startDate},
      ${endDate},
      ${remarks || null}
    )
    RETURNING *;
  `;

  return rows[0];
};

export const listLeaveRequests = async ({ userId, role }) => {
  const rows = role === "HR" || role === "ADMIN"
    ? await sql`
        SELECT lr.*, e.first_name, e.last_name, u.email AS employee_email
        FROM leave_requests lr
        JOIN employees e ON e.id = lr.employee_id
        JOIN users u ON u.id = e.user_id
        ORDER BY lr.created_at DESC;
      `
    : await sql`
        SELECT lr.*, e.first_name, e.last_name, u.email AS employee_email
        FROM leave_requests lr
        JOIN employees e ON e.id = lr.employee_id
        JOIN users u ON u.id = e.user_id
        WHERE e.user_id = ${userId}
        ORDER BY lr.created_at DESC;
      `;

  return rows;
};

export const findLeaveRequestById = async (id) => {
  const rows = await sql`
    SELECT id, employee_id, leave_type, start_date, end_date, remarks,
           review_comment, status, reviewed_by
    FROM leave_requests
    WHERE id = ${id}
    LIMIT 1;
  `;

  return rows[0] || null;
};

export const updateLeaveRequest = async ({
  id,
  status,
  reviewedBy,
  reviewComment,
}) => {
  const rows = await sql`
    UPDATE leave_requests
    SET
      status = ${status},
      reviewed_by = ${reviewedBy},
      review_comment = ${reviewComment || null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `;

  return rows[0] || null;
};
