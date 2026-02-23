import { Router } from "express";
import * as templateController from "../controllers/templateController.js";
import { protectAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createTemplateValidator,
  updateTemplateValidator,
  templateIdParam,
} from "../validators/templateValidators.js";

const router = Router();

// Public
router.get("/", templateController.list);
router.get("/:id", templateController.getById);

// Admin only
router.post("/", protectAdmin, createTemplateValidator, validate, templateController.create);
router.put("/:id", protectAdmin, updateTemplateValidator, validate, templateController.update);
router.delete("/:id", protectAdmin, templateIdParam, validate, templateController.remove);

export default router;
