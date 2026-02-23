import { validationResult } from "express-validator";
import { sendError, HTTP } from "../utils/response.js";

/**
 * Runs express-validator and returns 422 with errors if validation failed.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP.UNPROCESSABLE).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}
