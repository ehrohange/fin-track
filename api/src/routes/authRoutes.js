import { Router } from "express";
import { authLogin } from "../controllers/authController.js";

const router = Router();

router.post("/login", authLogin);

export default router;