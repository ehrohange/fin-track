import BudgetTransaction from "../Models/BudgetTransaction";
import { errorHandler } from "../utils/error";

export const addBudgetTransaction = async (req, res, next) => {
  const { userId, transDate, transType, transName, transKind, amount } =
    req.body;
  try {
    if (
      !userId ||
      !transDate ||
      !transType ||
      !transName ||
      !transKind ||
      !amount
    ) {
      return next(errorHandler(400, "All fields are required."));
    }
    const newTransaction = await BudgetTransaction.create({
      userId,
      transDate,
      transType,
      transName,
      transKind,
      amount,
    });

    return res
      .status(201)
      .json({
        message: "Transaction added successfully!",
        transaction: newTransaction,
      });
  } catch (error) {
    next(error);
  }
};

export const getBudgetTransactions = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const transactions = await BudgetTransaction.find({userId});
        if (!transactions) return next(errorHandler(404, "No records found."));
        return res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};

export const getBudgetTransactionsByDate = async (req, res, next) => {
  const { userId } = req.params;
  const { date } = req.query; // expected: "Aug 7 2025"

  try {
    if (!date) return next(errorHandler(400, "Date is required."));

    // Parse string date -> JS Date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return next(errorHandler(400, "Invalid date format. Use 'Mmm DD YYYY'"));
    }

    // Create day range
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const transactions = await BudgetTransaction.find({
      userId,
      transDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!transactions.length) {
      return next(errorHandler(404, "No records found for that date."));
    }

    return res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

export const deleteBudgetTransaction = async (req, res, next) => {
    const { id } = req.params;
    try {
        const transaction = await BudgetTransaction.findByIdAndDelete(id);
        if (!transaction) return next(errorHandler(404, "Transaction not found."));
        return res.status(200).json({message: "Transaction deleted successfully."});
    } catch (error) {
        next(error);
    }
}