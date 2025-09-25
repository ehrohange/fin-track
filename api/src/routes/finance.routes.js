import { Router } from "express";
import {
  createCategory,
  createGoal,
  createTransaction,
  getCategories,
  getCategoriesByType,
  getTransactionsByUserId,
  getTransactionsByUserIdAndDate,
  deleteTransaction,
  getGoals,
  updateGoal,
  deactivateGoal,
  activateGoal,
  deleteGoal,
} from "../controllers/finance.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = Router();

router.get("/categories", authenticateUser, rateLimiter, getCategories);
router.get("/categories/:type", authenticateUser, rateLimiter, getCategoriesByType);
router.post("/category", authenticateUser, rateLimiter, createCategory);
router.post("/transaction/:userId/:categoryId", authenticateUser, rateLimiter, createTransaction);
router.get("/transactions/:userId", authenticateUser, rateLimiter, getTransactionsByUserId);
router.get("/transactionsByDate/:userId", authenticateUser, rateLimiter, getTransactionsByUserIdAndDate);
router.delete("/transaction/:userId/:transactionId", authenticateUser, rateLimiter, deleteTransaction);
router.post("/goal/:userId/:categoryId", authenticateUser, rateLimiter, createGoal);
router.get("/goals/:userId", authenticateUser, rateLimiter, getGoals);
router.patch("/goal/:goalId", authenticateUser, rateLimiter, updateGoal);
router.patch("/goal/deactivate/:goalId", authenticateUser, rateLimiter, deactivateGoal);
router.patch("/goal/activate/:goalId", authenticateUser, rateLimiter, activateGoal);
router.delete("/goal/:goalId", authenticateUser, rateLimiter, deleteGoal);
export default router;
