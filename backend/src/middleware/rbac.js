import { forbidden } from "../utils/errors.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(forbidden("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(forbidden("You do not have permission to perform this action"));
    }

    next();
  };
};