import { Router } from "express";

import {
  signupController,
  loginController,
  verifyEmailController,
  meController,
  logoutController,
} from "../../controllers/auth/auth.controller.js";

import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.post("/signup", signupController);

router.post("/login", loginController);

router.post("/verify-email", verifyEmailController);

router.get("/me", authenticate, meController);

router.post("/logout", authenticate, logoutController);

export default router;