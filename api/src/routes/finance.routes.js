import { Router } from "express";
import { createCategory, createTransaction, getCategories, getCategoriesByType, getTransactionsByUserId, getTransactionsByUserIdAndDate } from "../controllers/finance.controller.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/categories/:type", getCategoriesByType);
router.post("/category", createCategory);
router.post("/transaction/:userId/:categoryId", createTransaction);
router.get("/transactions/:userId", getTransactionsByUserId);
router.get("/transactionsByDate/:userId", getTransactionsByUserIdAndDate);

export default router;