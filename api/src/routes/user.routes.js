import { Router } from "express";
import { getUsers, createUser, updateUserDetails, updateUserPassword, deleteUser } from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = Router();

router.get("/", rateLimiter, getUsers);
router.post("/", rateLimiter, createUser);
router.patch("/name/:userId", authenticateUser, rateLimiter, updateUserDetails);
router.patch("/password/:userId", authenticateUser, rateLimiter, updateUserPassword);
router.delete("/:userId", authenticateUser, rateLimiter, deleteUser);

export default router;