import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";

export function generateUserToken(userId) {
  return jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

export function generateAdminToken(adminId) {
  return jwt.sign({ adminId }, config.jwt.adminSecret, { expiresIn: config.jwt.adminExpiresIn });
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) return null;
  const userMatch = await user.comparePassword(password);
  if (!userMatch) return null;
  return user;
}

export async function registerUser(name, email, password) {
  const existing = await User.findOne({ email });
  if (existing) return { conflict: true };
  const user = await User.create({ name, email, password });
  return { user };
}

export async function loginAdmin(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const passwordStr = password != null ? String(password) : "";
  if (normalizedEmail && passwordStr) {
    const admin = await Admin.findOne({ email: normalizedEmail }).select("+password");
    if (admin) {
      const adminMatch = await admin.comparePassword(passwordStr);
      if (adminMatch) return admin;
    }
  }
  return null;
}

/**
 * Ensure at least one admin exists; create default from env if none.
 * If an admin with ADMIN_EMAIL already exists, sync their password from env.
 * Email/password from env are trimmed and email lowercased so .env quirks don't break login.
 */
export async function ensureDefaultAdmin() {
  const defaultEmail = String(config.admin.email || "").trim().toLowerCase();
  const rawPassword = config.admin.password;
  const defaultPassword =
    rawPassword === undefined || rawPassword === null ? "" : String(rawPassword).trim();
  if (defaultEmail && defaultPassword) {
    const admin = await Admin.findOne({ email: defaultEmail }).select("+password");
    if (admin) {
      admin.password = defaultPassword;
      await admin.save(); // pre-save hook re-hashes
      return;
    }
    // No admin with this email: create one so .env credentials work (even if other admins exist)
    await Admin.create({
      name: "Admin User",
      email: defaultEmail,
      password: defaultPassword,
    });
  }
}
