import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { protectAdmin } from "../middleware/auth.js";
import { param } from "express-validator";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", protectAdmin, userController.list);
router.delete(
  "/:id",
  protectAdmin,
  [param("id").isMongoId().withMessage("Invalid user ID")],
  validate,
  userController.remove
);

export default router;
