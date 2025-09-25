import { Router } from "express";
import { authLogin, authGoogleLogin } from "../controllers/auth.controller.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", rateLimiter, authLogin);
router.post("/google", rateLimiter, authGoogleLogin);

export default router;