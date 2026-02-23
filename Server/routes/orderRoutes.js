import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { protectUser, protectAdmin } from "../middleware/auth.js";
import { optionalUser } from "../middleware/optionalAuth.js";
import { validate } from "../middleware/validate.js";
import {
  createOrderValidator,
  orderIdParam,
  updateStatusValidator,
} from "../validators/orderValidators.js";

const router = Router();

// Create order: optional auth (guest or logged-in). optionalUser attaches req.user if token valid.
router.post("/", createOrderValidator, validate, optionalUser, (req, res, next) => {
  if (req.user) return orderController.create(req, res, next);
  return orderController.createGuest(req, res, next);
});

// User: my orders
router.get("/me", protectUser, orderController.listMy);

// Admin: all orders
router.get("/admin", protectAdmin, orderController.listAdmin);

// Admin: update status
router.patch("/:id/status", protectAdmin, updateStatusValidator, validate, orderController.updateStatus);

export default router;
