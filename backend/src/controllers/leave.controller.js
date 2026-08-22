import {
  createLeave,
  getLeaves,
  updateLeave,
} from "../services/leave.service.js";
import {
  createdResponse,
  successResponse,
} from "../utils/response.js";

export const createLeaveController = async (req, res, next) => {
  try {
    const leave = await createLeave({
      userId: req.user.id,
      leaveType: req.body.leave_type,
      startDate: req.body.start_date,
      endDate: req.body.end_date,
      remarks: req.body.remarks,
    });

    return createdResponse(res, leave, "Leave request created");
  } catch (error) {
    next(error);
  }
};

export const getLeavesController = async (req, res, next) => {
  try {
    const leaves = await getLeaves({
      userId: req.user.id,
      role: req.user.role,
    });

    return successResponse(res, leaves, "Leave requests retrieved");
  } catch (error) {
    next(error);
  }
};

export const updateLeaveController = async (req, res, next) => {
  try {
    const leave = await updateLeave({
      id: req.params.id,
      status: req.body.status,
      reviewedBy: req.user.id,
      reviewComment: req.body.review_comment,
    });

    return successResponse(res, leave, "Leave request updated");
  } catch (error) {
    next(error);
  }
};
