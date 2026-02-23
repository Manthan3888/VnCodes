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
  const match = await user.comparePassword(password);
  if (!match) return null;
  return user;
}

export async function registerUser(name, email, password) {
  const existing = await User.findOne({ email });
  if (existing) return { conflict: true };
  const user = await User.create({ name, email, password });
  return { user };
}

export async function loginAdmin(email, password) {
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) return null;
  const match = await admin.comparePassword(password);
  if (!match) return null;
  return admin;
}

/**
 * Ensure at least one admin exists; create default from env if none.
 */
export async function ensureDefaultAdmin() {
  const count = await Admin.countDocuments();
  if (count > 0) return;
  await Admin.create({
    name: "Admin User",
    email: config.admin.email,
    password: config.admin.password,
  });
}
