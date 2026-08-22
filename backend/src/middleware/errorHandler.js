import { errorResponse } from "../utils/response.js";

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;

  return errorResponse(
    res,
    error.message || "Internal server error",
    statusCode
  );
};