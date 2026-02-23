import mongoose from "mongoose";
import config from "./config/index.js";
import app from "./app.js";
import { ensureDefaultAdmin } from "./services/authService.js";
import { log, error as logError } from "./utils/logger.js";

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    log("MongoDB connected");
    await ensureDefaultAdmin();
    log("Default admin ensured");
  } catch (err) {
    logError("MongoDB connection failed", err);
    process.exit(1);
  }

  app.listen(config.port, () => {
    log(`Server running on port ${config.port}`);
  });
}

start();
