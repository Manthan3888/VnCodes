import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { protectUser, protectAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { registerValidator, loginValidator, adminLoginValidator } from "../validators/authValidators.js";

const router = Router();

// User auth
router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.get("/me", protectUser, authController.me);

// Admin auth
router.post("/admin/login", adminLoginValidator, validate, authController.adminLogin);
router.get("/admin/me", protectAdmin, authController.adminMe);

export default router;
