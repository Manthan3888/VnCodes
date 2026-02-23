import { sendError, HTTP } from "../utils/response.js";
import { error as logError } from "../utils/logger.js";

/**
 * Central error handling middleware.
 * Expects errors to have optional statusCode and message.
 */
export function errorHandler(err, req, res, next) {
  logError(err);

  const statusCode = err.statusCode || err.status || HTTP.SERVER_ERROR;
  const message = err.message || "Internal server error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(HTTP.BAD_REQUEST).json({ success: false, message: "Validation failed", errors });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return sendError(res, HTTP.CONFLICT, `${field} already exists.`);
  }

  return sendError(res, statusCode, message);
}
