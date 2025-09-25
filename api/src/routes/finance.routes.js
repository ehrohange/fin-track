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

const router = Router();

router.get("/categories", authenticateUser, getCategories);
router.get("/categories/:type", authenticateUser, getCategoriesByType);
router.post("/category", authenticateUser, createCategory);
router.post("/transaction/:userId/:categoryId", authenticateUser, createTransaction);
router.get("/transactions/:userId", authenticateUser, getTransactionsByUserId);
router.get("/transactionsByDate/:userId", authenticateUser, getTransactionsByUserIdAndDate);
router.delete("/transaction/:userId/:transactionId", authenticateUser, deleteTransaction);
router.post("/goal/:userId/:categoryId", authenticateUser, createGoal);
router.get("/goals/:userId", authenticateUser, getGoals);
router.patch("/goal/:goalId", authenticateUser, updateGoal);
router.patch("/goal/deactivate/:goalId", authenticateUser, deactivateGoal);
router.patch("/goal/activate/:goalId", authenticateUser, activateGoal);
router.delete("/goal/:goalId", authenticateUser, deleteGoal);
export default router;
