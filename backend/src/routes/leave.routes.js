import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import {
  createLeaveController,
  getLeavesController,
  updateLeaveController,
} from "../controllers/leave.controller.js";

const router = Router();

router.use(authenticate);
router.post("/", createLeaveController);
router.get("/", getLeavesController);
router.patch(
  "/:id",
  authorize("HR", "ADMIN"),
  updateLeaveController
);

export default router;
