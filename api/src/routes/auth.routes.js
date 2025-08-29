import { Router } from "express";
import { authLogin, authGoogleLogin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", authLogin);
router.post("/google", authGoogleLogin);

export default router;