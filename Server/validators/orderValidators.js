import { body, param } from "express-validator";

const orderItemValidator = [
  body("items.*.title").trim().notEmpty(),
  body("items.*.price").isFloat({ min: 0 }),
  body("items.*.quantity").isInt({ min: 1 }),
  body("items.*.id").optional(), // template id (string or number from frontend)
  body("items.*.templateId").optional(),
  body("items.*.originalPrice").optional().isFloat({ min: 0 }),
];

export const createOrderValidator = [
  body("customerEmail").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
  body("customerName").trim().notEmpty().withMessage("Customer name is required"),
  body("phoneNumber").optional().trim(),
  body("items").isArray({ min: 1 }).withMessage("At least one item required"),
  ...orderItemValidator,
  body("total").isFloat({ min: 0 }).withMessage("Total must be a positive number"),
  body("paymentMethod").optional().isIn(["INR", "USD"]),
  body("discountCode").optional().trim(),
];

export const orderIdParam = [param("id").isMongoId().withMessage("Invalid order ID")];

export const updateStatusValidator = [
  param("id").isMongoId().withMessage("Invalid order ID"),
  body("status").isIn(["pending", "completed", "cancelled"]).withMessage("Invalid status"),
];
