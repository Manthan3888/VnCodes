import dotenv from "dotenv";

dotenv.config();

const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/my-website",
  jwt: {
    secret: process.env.JWT_SECRET || "jwt-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    adminSecret: process.env.JWT_ADMIN_SECRET || "admin-jwt-secret-change-me",
    adminExpiresIn: process.env.JWT_ADMIN_EXPIRES_IN || "1d",
  },
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@vncodes.in",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },
};

export default config;
