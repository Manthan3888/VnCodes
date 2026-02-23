import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";
import { sendError, HTTP } from "../utils/response.js";

/**
 * Protect routes: require valid JWT (user).
 */
export async function protectUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return sendError(res, HTTP.UNAUTHORIZED, "Not authorized. Token required.");
    }
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return sendError(res, HTTP.UNAUTHORIZED, "User not found.");
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, HTTP.UNAUTHORIZED, "Token expired.");
    }
    if (err.name === "JsonWebTokenError") {
      return sendError(res, HTTP.UNAUTHORIZED, "Invalid token.");
    }
    return sendError(res, HTTP.SERVER_ERROR, "Authentication failed.");
  }
}

/**
 * Protect routes: require valid admin JWT.
 */
export async function protectAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return sendError(res, HTTP.UNAUTHORIZED, "Not authorized. Admin token required.");
    }
    const decoded = jwt.verify(token, config.jwt.adminSecret);
    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin) return sendError(res, HTTP.UNAUTHORIZED, "Admin not found.");
    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, HTTP.UNAUTHORIZED, "Token expired.");
    }
    if (err.name === "JsonWebTokenError") {
      return sendError(res, HTTP.UNAUTHORIZED, "Invalid token.");
    }
    return sendError(res, HTTP.SERVER_ERROR, "Authentication failed.");
  }
}
