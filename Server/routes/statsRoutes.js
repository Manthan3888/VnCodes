import { Router } from "express";
import * as statsController from "../controllers/statsController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();
router.get("/", protectAdmin, statsController.getStats);
export default router;
