import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import { protectAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdParam,
} from "../validators/categoryValidators.js";

const router = Router();

router.get("/", categoryController.list);
router.post("/", protectAdmin, createCategoryValidator, validate, categoryController.create);
router.put("/:id", protectAdmin, updateCategoryValidator, validate, categoryController.update);
router.delete("/:id", protectAdmin, categoryIdParam, validate, categoryController.remove);

export default router;
