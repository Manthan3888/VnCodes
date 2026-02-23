/** HTTP status codes */
export const HTTP = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
};

/** Order status enum */
export const ORDER_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/** Template type enum */
export const TEMPLATE_TYPE = {
  FREE: "free",
  PAID: "paid",
};

/** User roles */
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};
