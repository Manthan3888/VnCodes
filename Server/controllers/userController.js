import { sendSuccess, sendError, HTTP } from "../utils/response.js";
import { User } from "../models/User.js";

export async function list(req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return sendSuccess(res, HTTP.OK, {
      users: users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        joinedDate: u.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, HTTP.NOT_FOUND, "User not found.");
    return sendSuccess(res, HTTP.OK, {}, "User deleted.");
  } catch (err) {
    next(err);
  }
}
