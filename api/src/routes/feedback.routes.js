import { Router } from "express";
import rateLimiter from "../middleware/rateLimiter.js";
import { createReport } from "../controllers/feedback.controller.js";

const router = Router();

router.post("/report", rateLimiter, createReport);

export default router;