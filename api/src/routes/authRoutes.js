import { Router } from "express";
import { authLogin, authGoogleLogin } from "../controllers/authController.js";

const router = Router();

router.post("/login", authLogin);
router.post("/google", authGoogleLogin);

export default router;