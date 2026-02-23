import { body, param } from "express-validator";

export const createTemplateValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("originalPrice").isFloat({ min: 0 }).withMessage("Original price must be a positive number"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("templateType").optional().isIn(["free", "paid"]).withMessage("Must be free or paid"),
  body("fullTitle").optional().trim(),
  body("videoUrl").optional().trim(),
  body("videoFileName").optional().trim(),
  body("description").optional().trim(),
  body("videoData").optional(),
];

export const updateTemplateValidator = [
  param("id").isMongoId().withMessage("Invalid template ID"),
  body("title").optional().trim().notEmpty(),
  body("originalPrice").optional().isFloat({ min: 0 }),
  body("price").optional().isFloat({ min: 0 }),
  body("category").optional().trim().notEmpty(),
  body("templateType").optional().isIn(["free", "paid"]),
  body("fullTitle").optional().trim(),
  body("videoUrl").optional().trim(),
  body("videoFileName").optional().trim(),
  body("description").optional().trim(),
  body("videoData").optional(),
];

export const templateIdParam = [param("id").isMongoId().withMessage("Invalid template ID")];
