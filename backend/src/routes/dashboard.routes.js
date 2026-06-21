import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, authorize("ADMIN"), getDashboard);

export default router;
