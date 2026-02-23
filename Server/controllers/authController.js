import { sendSuccess, sendError, HTTP } from "../utils/response.js";
import * as authService from "../services/authService.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password);
    if (result.conflict) {
      return sendError(res, HTTP.CONFLICT, "User with this email already exists.");
    }
    const user = result.user;
    const token = authService.generateUserToken(user._id.toString());
    return sendSuccess(res, HTTP.CREATED, {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        joinedDate: user.createdAt.toISOString(),
      },
      token,
    }, "Registered successfully.");
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    if (!user) {
      return sendError(res, HTTP.UNAUTHORIZED, "Invalid email or password.");
    }
    const token = authService.generateUserToken(user._id.toString());
    return sendSuccess(res, HTTP.OK, {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        joinedDate: user.createdAt.toISOString(),
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = req.user;
    return sendSuccess(res, HTTP.OK, {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        joinedDate: user.createdAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await authService.loginAdmin(email, password);
    if (!admin) {
      return sendError(res, HTTP.UNAUTHORIZED, "Invalid email or password.");
    }
    const token = authService.generateAdminToken(admin._id.toString());
    return sendSuccess(res, HTTP.OK, {
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

export async function adminMe(req, res, next) {
  try {
    const admin = req.admin;
    return sendSuccess(res, HTTP.OK, {
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    next(err);
  }
}
