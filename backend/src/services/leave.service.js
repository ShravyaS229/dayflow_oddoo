import {
  badRequest,
  notFound,
} from "../utils/errors.js";
import {
  createLeaveRequest,
  findEmployeeByUserId,
  findLeaveRequestById,
  listLeaveRequests,
  updateLeaveRequest,
} from "../repositories/leave.repository.js";

const allowedLeaveTypes = new Set(["paid", "sick", "unpaid"]);
const allowedStatuses = new Set(["approved", "rejected"]);

const validateDates = (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw badRequest("start_date and end_date are required");
  }

  if (endDate < startDate) {
    throw badRequest("end_date must be on or after start_date");
  }
};

export const createLeave = async ({
  userId,
  leaveType,
  startDate,
  endDate,
  remarks,
}) => {
  if (!allowedLeaveTypes.has(leaveType)) {
    throw badRequest("leave_type must be one of: paid, sick, unpaid");
  }

  validateDates(startDate, endDate);

  const employee = await findEmployeeByUserId(userId);

  if (!employee) {
    throw notFound("Employee profile not found");
  }

  return createLeaveRequest({
    employeeId: employee.id,
    leaveType,
    startDate,
    endDate,
    remarks,
  });
};

export const getLeaves = async ({ userId, role }) => {
  return listLeaveRequests({ userId, role });
};

export const updateLeave = async ({
  id,
  status,
  reviewedBy,
  reviewComment,
}) => {
  if (!allowedStatuses.has(status)) {
    throw badRequest("status must be approved or rejected");
  }

  if (status === "rejected" && !reviewComment?.trim()) {
    throw badRequest("review_comment is required when rejecting a leave request");
  }

  const existingLeave = await findLeaveRequestById(id);

  if (!existingLeave) {
    throw notFound("Leave request not found");
  }

  if (existingLeave.status !== "pending") {
    throw badRequest("Only pending leave requests can be reviewed");
  }

  return updateLeaveRequest({
    id,
    status,
    reviewedBy,
    reviewComment: reviewComment?.trim(),
  });
};
