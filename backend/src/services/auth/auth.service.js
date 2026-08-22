import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { env } from "../../config/env.js";
import {
  findUserByEmail,
  findUserById,
  createUser,
  getRoleId,
  verifyUserEmail,
} from "../../repositories/auth/user.repository.js";

import {
  badRequest,
  unauthorized,
  notFound,
} from "../../utils/errors.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee_id || null,
    },
    env.jwtSecret,
    {
      expiresIn: "1d",
    }
  );
};

export const signup = async ({
  email,
  password,
  firstName,
  lastName,
}) => {
  if (!email || !password || !firstName) {
    throw badRequest("Email, password and first name are required");
  }

  if (password.length < 8) {
    throw badRequest("Password must contain at least 8 characters");
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw badRequest("Email is already registered");
  }

  const role = await getRoleId("EMPLOYEE");

  if (!role) {
    throw new Error("EMPLOYEE role is not configured");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const verificationTokenExpiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  const user = await createUser({
    email,
    passwordHash,
    roleId: role.id,
    verificationToken,
    verificationTokenExpiresAt,
  });

  return {
    user,
    verificationToken,
  };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw badRequest("Email and password are required");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw unauthorized("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw unauthorized("Invalid email or password");
  }

  if (!user.email_verified) {
    throw unauthorized("Please verify your email before logging in");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const verifyEmail = async (token) => {
  if (!token) {
    throw badRequest("Verification token is required");
  }

  const user = await verifyUserEmail(token);

  if (!user) {
    throw badRequest("Invalid or expired verification token");
  }

  return user;
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw notFound("User not found");
  }

  return user;
};