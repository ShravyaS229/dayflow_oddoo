import {
  signup,
  login,
  verifyEmail,
  getCurrentUser,
} from "../../services/auth/auth.service.js";

import {
  successResponse,
  createdResponse,
} from "../../utils/response.js";

export const signupController = async (req, res, next) => {
  try {
    const result = await signup(req.body);

    return createdResponse(
      res,
      result,
      "Account created successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body);

    return successResponse(
      res,
      result,
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (req, res, next) => {
  try {
    const result = await verifyEmail(req.body.token);

    return successResponse(
      res,
      result,
      "Email verified successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const meController = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);

    return successResponse(
      res,
      user,
      "Current user retrieved"
    );
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res) => {
  return successResponse(
    res,
    null,
    "Logout successful"
  );
};