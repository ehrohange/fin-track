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
} from "../controllers/finance.controller.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/categories/:type", getCategoriesByType);
router.post("/category", createCategory);
router.post("/transaction/:userId/:categoryId", createTransaction);
router.get("/transactions/:userId", getTransactionsByUserId);
router.get("/transactionsByDate/:userId", getTransactionsByUserIdAndDate);
router.delete("/transaction/:userId/:transactionId", deleteTransaction);
router.post("/goal/:userId/:categoryId", createGoal);
router.get("/goals/:userId", getGoals);
router.patch("/goal/:goalId", updateGoal);

export default router;
