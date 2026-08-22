import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { unauthorized } from "../utils/errors.js";

export const authenticate = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw unauthorized("Authentication token required");
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(unauthorized("Token expired"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(unauthorized("Invalid token"));
    }

    next(error);
  }
};