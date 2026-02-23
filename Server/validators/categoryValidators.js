import { body, param } from "express-validator";

export const createCategoryValidator = [
  body("id").trim().notEmpty().withMessage("Category id (slug) is required"),
  body("label").trim().notEmpty().withMessage("Label is required"),
  body("icon").optional().trim(),
];

export const updateCategoryValidator = [
  param("id").notEmpty().withMessage("Category id required"),
  body("label").optional().trim().notEmpty(),
  body("icon").optional().trim(),
];

export const categoryIdParam = [param("id").notEmpty().withMessage("Category id required")];
