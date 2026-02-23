import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { User } from "../models/User.js";

/**
 * Optionally attach user to req if valid Bearer token present. Never fails.
 */
export async function optionalUser(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.userId).select("-password");
    if (user) req.user = user;
  } catch (_) {
    // ignore invalid/expired token
  }
  next();
}
