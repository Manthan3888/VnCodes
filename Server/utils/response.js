import { HTTP } from "./constants.js";

/**
 * Centralized API response format
 * @param {import("express").Response} res
 * @param {number} statusCode
 * @param {object} data
 * @param {string} [message]
 */
export function sendSuccess(res, statusCode, data, message) {
  return res.status(statusCode).json({
    success: true,
    message: message || undefined,
    ...data,
  });
}

/**
 * Centralized error response
 * @param {import("express").Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {object} [errors]
 */
export function sendError(res, statusCode, message, errors = null) {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
}

export { HTTP };
